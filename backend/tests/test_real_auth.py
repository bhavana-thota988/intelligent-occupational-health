import sys
import os
import json
import sqlite3
import hmac
import hashlib
import unittest
from datetime import datetime, timedelta

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.entities import User

client = TestClient(app)

class TestWorkHealthAuth(unittest.TestCase):

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_1_invalid_and_reserved_email_rejection(self):
        """Verify that placeholder emails, reserved test domains, and disposable emails are rejected."""
        test_emails = [
            "test@example.com",
            "user@example.com",
            "admin@example.com",
            "abc@fake.com",
            "mockuser@test.com",
            "throwaway@mailinator.com",
            "temp@tempmail.com",
            "missingatdomain.com",
            "nodot@domain",
            "test@localhost"
        ]

        for email in test_emails:
            res = client.post("/api/auth/register", json={
                "name": "Invalid Tester",
                "email": email,
                "password": "Corporate2026!"
            })
            self.assertEqual(res.status_code, 400, f"Expected 400 for '{email}', got {res.status_code}: {res.text}")
            self.assertIn("detail", res.json())

    def test_2_role_tampering_rejection(self):
        """Verify that public registration attempts for admin or trainer roles are blocked."""
        # Attempt Admin registration
        res_admin = client.post("/api/auth/register", json={
            "name": "Hacker Admin",
            "email": "hacker.admin@legitdomain.org",
            "password": "Corporate2026!",
            "role": "admin"
        })
        self.assertEqual(res_admin.status_code, 403, "Public admin registration must return 403 Forbidden")

        # Attempt Trainer registration
        res_trainer = client.post("/api/auth/register", json={
            "name": "Hacker Trainer",
            "email": "hacker.trainer@legitdomain.org",
            "password": "Corporate2026!",
            "role": "trainer"
        })
        self.assertEqual(res_trainer.status_code, 403, "Public trainer registration must return 403 Forbidden")

    def test_3_legitimate_registration_and_otp_hashing(self):
        """Verify that valid employee registration generates an unverified record with HMAC hashed OTP."""
        test_email = "employee.test.suite@workhealth.ai"

        # Cleanup prior test run if exists
        prior = self.db.query(User).filter(User.email == test_email).first()
        if prior:
            self.db.delete(prior)
            self.db.commit()

        res = client.post("/api/auth/register", json={
            "name": "Suite Tester",
            "email": test_email,
            "password": "ValidPassword2026!",
            "department": "Engineering",
            "job_role": "QA Lead"
        })
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["email"], test_email)

        # Inspect DB state
        user = self.db.query(User).filter(User.email == test_email).first()
        self.assertIsNotNone(user)
        self.assertFalse(user.is_verified)
        self.assertIsNotNone(user.otp_hash)
        # Check that OTP hash is 64 hex characters (SHA256)
        self.assertEqual(len(user.otp_hash), 64)
        self.assertEqual(user.otp_attempts, 0)

    def test_4_otp_attempt_limits_and_lockout(self):
        """Verify that 5 failed attempts locks out and destroys the OTP code."""
        test_email = "otp.lockout.test@workhealth.ai"

        # Create or update user
        client.post("/api/auth/register", json={
            "name": "Lockout User",
            "email": test_email,
            "password": "ValidPassword2026!"
        })

        # Submit 4 wrong attempts
        for attempt in range(1, 5):
            res = client.post("/api/auth/verify-otp", json={
                "email": test_email,
                "otp": "000000"
            })
            self.assertEqual(res.status_code, 400)
            expected_remaining = 5 - attempt
            self.assertIn(f"{expected_remaining} attempt(s) remaining", res.json()["detail"])

        # 5th attempt: must lockout and invalidate
        res_5 = client.post("/api/auth/verify-otp", json={
            "email": test_email,
            "otp": "000000"
        })
        self.assertEqual(res_5.status_code, 400)
        self.assertIn("Too many incorrect attempts (5/5)", res_5.json()["detail"])

        # Subsequent attempt: OTP is gone
        res_after = client.post("/api/auth/verify-otp", json={
            "email": test_email,
            "otp": "000000"
        })
        self.assertEqual(res_after.status_code, 400)
        self.assertIn("No active verification code", res_after.json()["detail"])

    def test_5_resend_cooldown_rate_limit(self):
        """Verify that requesting an OTP resend enforces a 60-second cooldown."""
        test_email = "cooldown.test@workhealth.ai"
        client.post("/api/auth/register", json={
            "name": "Cooldown Tester",
            "email": test_email,
            "password": "ValidPassword2026!"
        })

        # Immediate resend should trigger 429
        res = client.post("/api/auth/resend-otp", json={"email": test_email})
        self.assertEqual(res.status_code, 429)
        self.assertIn("Please wait", res.json()["detail"])

    def test_6_valid_otp_verification_and_login(self):
        """Verify that supplying the correct OTP activates the account and issues a valid JWT."""
        test_email = "verified.worker@workhealth.ai"
        prior = self.db.query(User).filter(User.email == test_email).first()
        if prior:
            self.db.delete(prior)
            self.db.commit()

        client.post("/api/auth/register", json={
            "name": "Verified Worker",
            "email": test_email,
            "password": "WorkHealth2026!"
        })

        user = self.db.query(User).filter(User.email == test_email).first()
        stored_hash = user.otp_hash

        # Find the matching 6-digit OTP code for test verification
        correct_otp = None
        for code in range(100000, 1000000):
            cand = str(code)
            h = hmac.new(settings.SECRET_KEY.encode(), cand.encode(), hashlib.sha256).hexdigest()
            if h == stored_hash:
                correct_otp = cand
                break

        self.assertIsNotNone(correct_otp, "Should find the corresponding 6-digit OTP code")

        # Submit valid OTP
        res_verify = client.post("/api/auth/verify-otp", json={
            "email": test_email,
            "otp": correct_otp
        })
        self.assertEqual(res_verify.status_code, 200)
        verify_data = res_verify.json()
        self.assertTrue(verify_data["verified"])
        self.assertIn("access_token", verify_data)

        # Login with newly verified credentials
        res_login = client.post("/api/auth/login", json={
            "email": test_email,
            "password": "WorkHealth2026!",
            "requested_portal": "employee"
        })
        self.assertEqual(res_login.status_code, 200)
        login_data = res_login.json()
        self.assertEqual(login_data["user"]["role"], "employee")
        self.assertTrue(login_data["user"]["is_verified"])

        # Attempt to access Admin portal with Employee credentials
        res_cross = client.post("/api/auth/login", json={
            "email": test_email,
            "password": "WorkHealth2026!",
            "requested_portal": "admin"
        })
        self.assertEqual(res_cross.status_code, 403, "Employee must be rejected from Admin portal")

    def test_7_admin_bootstrap_and_trainer_invitation(self):
        """Verify that the bootstrapped admin can sign in and invite a clinical trainer."""
        # Admin login
        res_admin = client.post("/api/auth/login", json={
            "email": settings.ADMIN_BOOTSTRAP_EMAIL,
            "password": settings.ADMIN_BOOTSTRAP_PASSWORD,
            "requested_portal": "admin"
        })
        self.assertEqual(res_admin.status_code, 200)
        self.assertEqual(res_admin.json()["user"]["role"], "admin")

        # Admin invites trainer
        trainer_email = "dr.elena.rostova@clinichealth.org"
        prior_trainer = self.db.query(User).filter(User.email == trainer_email).first()
        if prior_trainer:
            self.db.delete(prior_trainer)
            self.db.commit()

        res_invite = client.post("/api/admin/trainers/invite", json={
            "name": "Dr. Elena Rostova",
            "email": trainer_email,
            "specialty": "Autonomic Sleep & Posture Coach"
        })
        self.assertEqual(res_invite.status_code, 200)
        invite_data = res_invite.json()
        self.assertTrue(invite_data["success"])
        self.assertTrue(invite_data["trainer_id"].startswith("TR-"))

        # Verify trainer was saved with role='trainer'
        trainer = self.db.query(User).filter(User.email == trainer_email).first()
        self.assertIsNotNone(trainer)
        self.assertEqual(trainer.role, "trainer")
        self.assertFalse(trainer.is_verified)

    def test_8_password_reset_flow(self):
        """Verify that forgot-password and reset-password work with OTP."""
        test_email = "password.reset.test@workhealth.ai"
        prior = self.db.query(User).filter(User.email == test_email).first()
        if prior:
            self.db.delete(prior)
            self.db.commit()

        client.post("/api/auth/register", json={
            "name": "Reset User",
            "email": test_email,
            "password": "OldPassword2026!"
        })

        # Request password reset
        res_req = client.post("/api/auth/forgot-password", json={"email": test_email})
        self.assertEqual(res_req.status_code, 200)

        user = self.db.query(User).filter(User.email == test_email).first()
        stored_hash = user.otp_hash

        # Find reset OTP
        reset_otp = None
        for code in range(100000, 1000000):
            cand = str(code)
            h = hmac.new(settings.SECRET_KEY.encode(), cand.encode(), hashlib.sha256).hexdigest()
            if h == stored_hash:
                reset_otp = cand
                break

        # Submit reset password
        res_reset = client.post("/api/auth/reset-password", json={
            "email": test_email,
            "otp": reset_otp,
            "new_password": "NewUpdatedPassword2026!",
            "confirm_password": "NewUpdatedPassword2026!"
        })
        self.assertEqual(res_reset.status_code, 200)

        # Mark user verified to test login with new password
        user.is_verified = True
        self.db.commit()

        # Login with new password
        res_login = client.post("/api/auth/login", json={
            "email": test_email,
            "password": "NewUpdatedPassword2026!"
        })
        self.assertEqual(res_login.status_code, 200)

if __name__ == "__main__":
    unittest.main()
