import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.entities import User
from app.core.security import verify_password

class TestEmployeeAuthSQLite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        # Clean up any test users created during testing
        test_emails = [
            "real.employee.test@gmail.com",
            "outlook.employee.test@outlook.com"
        ]
        for email in test_emails:
            user = cls.db.query(User).filter(User.email == email).first()
            if user:
                cls.db.delete(user)
        cls.db.commit()
        cls.db.close()

    def test_01_reject_reserved_and_invalid_emails(self):
        # Reserved test domain / example.com
        res = self.client.post("/api/auth/register", json={
            "name": "Example Employee",
            "email": "employee@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        })
        self.assertEqual(res.status_code, 400)
        detail = res.json()["detail"].lower()
        self.assertTrue("not allowed" in detail or "reserved" in detail)

        # Test domain
        res2 = self.client.post("/api/auth/register", json={
            "name": "Test User",
            "email": "test@test.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        })
        self.assertEqual(res2.status_code, 400)

        # Invalid email syntax
        res3 = self.client.post("/api/auth/register", json={
            "name": "Invalid Email",
            "email": "invalid-email-no-at",
            "password": "Password123!",
            "confirm_password": "Password123!"
        })
        self.assertEqual(res3.status_code, 400)

    def test_02_register_valid_gmail_employee(self):
        # Register genuine gmail account
        test_email = "real.employee.test@gmail.com"
        res = self.client.post("/api/auth/register", json={
            "name": "Bhavana Personal",
            "email": test_email,
            "password": "MySecretPass2026!",
            "confirm_password": "MySecretPass2026!"
        })
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("email"), test_email)

        # Confirm saved in SQLite
        db = SessionLocal()
        saved_user = db.query(User).filter(User.email == test_email).first()
        self.assertIsNotNone(saved_user)
        self.assertEqual(saved_user.name, "Bhavana Personal")
        self.assertEqual(saved_user.role, "employee")
        self.assertTrue(saved_user.is_active)
        self.assertTrue(saved_user.is_verified)
        self.assertEqual(saved_user.approval_status, "approved")
        # Confirm password hashed with bcrypt and not plain-text
        self.assertNotEqual(saved_user.hashed_password, "MySecretPass2026!")
        self.assertTrue(verify_password("MySecretPass2026!", saved_user.hashed_password))
        db.close()

    def test_03_prevent_duplicate_registration(self):
        # Re-register same email
        res = self.client.post("/api/auth/register", json={
            "name": "Bhavana Duplicate",
            "email": "real.employee.test@gmail.com",
            "password": "DifferentPassword123!",
            "confirm_password": "DifferentPassword123!"
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("already exists", res.json()["detail"].lower())

    def test_04_signin_with_exact_credentials(self):
        res = self.client.post("/api/auth/login", json={
            "email": "real.employee.test@gmail.com",
            "password": "MySecretPass2026!",
            "requested_portal": "employee"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], "real.employee.test@gmail.com")
        self.assertEqual(data["user"]["role"], "employee")

    def test_05_signin_reject_wrong_password(self):
        res = self.client.post("/api/auth/login", json={
            "email": "real.employee.test@gmail.com",
            "password": "WrongPassword!",
            "requested_portal": "employee"
        })
        self.assertEqual(res.status_code, 401)
        self.assertIn("incorrect password", res.json()["detail"].lower())

    def test_06_signin_reject_unregistered_email(self):
        res = self.client.post("/api/auth/login", json={
            "email": "nonexistent.employee.999@gmail.com",
            "password": "AnyPassword123!",
            "requested_portal": "employee"
        })
        self.assertEqual(res.status_code, 401)
        self.assertIn("no account found", res.json()["detail"].lower())

    def test_07_employee_cross_role_access_blocked(self):
        # Employee attempting to access Trainer Console
        res_trainer = self.client.post("/api/auth/login", json={
            "email": "real.employee.test@gmail.com",
            "password": "MySecretPass2026!",
            "requested_portal": "trainer"
        })
        self.assertEqual(res_trainer.status_code, 403)
        self.assertIn("access denied", res_trainer.json()["detail"].lower())

        # Employee attempting to access Admin Console
        res_admin = self.client.post("/api/auth/login", json={
            "email": "real.employee.test@gmail.com",
            "password": "MySecretPass2026!",
            "requested_portal": "admin"
        })
        self.assertEqual(res_admin.status_code, 403)
        self.assertIn("access denied", res_admin.json()["detail"].lower())

    def test_08_trainer_and_admin_still_functional(self):
        # Trainer login
        res_tr = self.client.post("/api/auth/login", json={
            "email": "trainer@company.com",
            "password": "Corporate2026!",
            "requested_portal": "trainer"
        })
        self.assertEqual(res_tr.status_code, 200)
        self.assertEqual(res_tr.json()["user"]["role"], "trainer")

        # Admin login
        res_adm = self.client.post("/api/auth/login", json={
            "email": "admin@company.com",
            "password": "Corporate2026!",
            "requested_portal": "admin"
        })
        self.assertEqual(res_adm.status_code, 200)
        self.assertEqual(res_adm.json()["user"]["role"], "admin")

if __name__ == "__main__":
    unittest.main()
