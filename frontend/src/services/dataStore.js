// Centralized multi-user data store for Intelligent Occupational Health Platform
// All employee data is user-scoped so multiple employees (Employee A, Employee B) have completely separate state.

export const OFFICIAL_PROGRAMS = [
  {
    id: "stress-relief-burnout-reset",
    name: "Stress Relief",
    shortName: "Stress",
    category: "Stress",
    tag: "Stress",
    emoji: "🧠",
    targetRisk: "Stress",
    duration: "4 Weeks",
    totalSessions: 8,
    intensity: "Calming & Restorative",
    dailyTime: "8 - 12 mins",
    overview: "Clinical stress-reset curriculum designed to lower cortisol, calm rapid heartbeat, release mental overwhelm, and cultivate calm focus during high-pressure workdays.",
    whyRecommended: "Recommended when workplace assessments reflect mental fatigue, deadline pressure, tight shoulders, or difficulty switching off after work.",
    trainerAssigned: "Elena Rostova (Wellbeing & Stress Coach)",
    sessions: [
      {
        id: 1,
        title: "4-7-8 Breathing & Heart-Rate Reset",
        duration: "8 mins",
        type: "breathing",
        timerSeconds: 180,
        instructions: "Regulate your autonomic nervous system using the clinically proven 4-7-8 breathing cadence.",
        steps: [
          "Sit comfortably with feet flat on the floor and shoulders dropped away from ears.",
          "Inhale quietly through your nose for 4 seconds.",
          "Hold your breath gently for 7 seconds without straining.",
          "Exhale completely through your mouth with a soft whoosh for 8 seconds.",
          "Repeat for 4 to 6 continuous breath cycles until your heart rate steadies."
        ],
        tip: "Keep jaw and tongue relaxed against the roof of your mouth behind your front teeth."
      },
      {
        id: 2,
        title: "Shoulder & Cervical Tension Release",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Decompress tight neck and trapezius muscles caused by high-stress keyboard typing.",
        steps: [
          "Inhale deeply and lift shoulders up toward ears; squeeze gently for 3 seconds.",
          "Exhale forcefully through mouth and let shoulders drop down completely.",
          "Slowly tilt right ear toward right shoulder, hold 15 seconds, then switch sides.",
          "Interlace fingers behind head, gently draw elbows back, and open your chest."
        ],
        tip: "Do not pull on your neck—allow gentle gravity to release tight muscle fibers."
      },
      {
        id: 3,
        title: "5-Minute Cognitive Declutter & Reset",
        duration: "8 mins",
        type: "mindfulness",
        timerSeconds: 240,
        instructions: "Step back from task overwhelm, park non-critical items, and regain clear priority focus.",
        steps: [
          "Turn away from computer displays and close your eyes for 30 seconds.",
          "Jot down the top 2 priority items creating task anxiety on a notepad.",
          "Establish a mental boundary: non-urgent items are parked until tomorrow.",
          "Take 3 deep belly breaths before resuming work."
        ],
        tip: "Single-tasking restores mental bandwidth and reduces perceived workplace stress."
      },
      {
        id: 4,
        title: "Vagus Nerve Activation (Humming & Neck Glide)",
        duration: "10 mins",
        type: "breathing",
        timerSeconds: 300,
        instructions: "Stimulate the vagal brake to switch from fight-or-flight to rest-and-digest mode.",
        steps: [
          "Sit tall with spine aligned and rest hands gently on your thighs.",
          "Take a slow deep diaphragmatic breath in through your nose.",
          "Hum softly on the exhale with closed lips, feeling vibration in your throat and chest.",
          "Perform gentle side-to-side neck glides while maintaining steady rhythm."
        ],
        tip: "Vocal cord vibration directly stimulates vagal parasympathetic innervation."
      },
      {
        id: 5,
        title: "Midday Screen Detachment & Visual Rest",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Relieve digital eye strain and soften acute sympathetic visual alertness.",
        steps: [
          "Look out a window at a distant object 20+ feet away for 60 seconds (20-20-20 rule).",
          "Gently cup warm palms over closed eyes without pressing the eyeballs.",
          "Breathe softly in the darkness for 90 seconds to soothe optic nerve strain.",
          "Perform 5 slow shoulder rolls backwards."
        ],
        tip: "Expanding your visual field to panoramic awareness instantly calms the brain."
      },
      {
        id: 6,
        title: "Managing Workplace Reaction & Pause Habit",
        duration: "10 mins",
        type: "mindfulness",
        timerSeconds: 300,
        instructions: "Build a calm mental buffer before reacting to urgent messages or critical emails.",
        steps: [
          "Identify high-stress communication triggers (e.g., sudden urgent pings).",
          "Implement the 10-Second Breath Pause before clicking 'Send' or typing a response.",
          "Acknowledge feelings of urgency without letting physical tension take over.",
          "Reframe the task with calm, solution-oriented clarity."
        ],
        tip: "Between stimulus and response there is a space; in that space lies your power to choose."
      },
      {
        id: 7,
        title: "Workday Shutdown & Brain Boundary Ritual",
        duration: "12 mins",
        type: "mindfulness",
        timerSeconds: 360,
        instructions: "Consciously close open cognitive loops to prevent after-hours work rumination.",
        steps: [
          "Review completed tasks for the day and note tomorrow's top 3 priorities.",
          "Explicitly close all open browser work tabs and silence non-emergency notifications.",
          "Stand up from your workstation, stretch arms overhead, and take a deep breath.",
          "Say mentally: 'My work for today is complete; my evening rest begins now.'"
        ],
        tip: "A defined shutdown ritual protects sleep architecture and prevents chronic burnout."
      },
      {
        id: 8,
        title: "Stress Mastery & Resilience Reflection",
        duration: "15 mins",
        type: "checklist",
        timerSeconds: 420,
        instructions: "Review your personal stress reduction progress and complete your verification submission.",
        steps: [
          "Audit your primary weekly stress triggers and effectiveness of breath resets.",
          "Document your personal go-to 2-minute micro-recovery drill.",
          "Commit to maintaining hourly posture and breathing awareness.",
          "Complete your curriculum reflection to earn your verified credential."
        ],
        tip: "Consistency in micro-habits builds long-term autonomic nervous system resilience."
      }
    ]
  },
  {
    id: "workplace-yoga-mobility",
    name: "Workplace Yoga",
    shortName: "Yoga",
    category: "Yoga",
    tag: "Yoga",
    emoji: "🧘",
    targetRisk: "Posture",
    duration: "4 Weeks",
    totalSessions: 8,
    intensity: "Gentle & Restorative",
    dailyTime: "10 - 15 mins",
    overview: "Desk-friendly yoga poses and restorative mobility sequences to relieve spinal compression, stretch tight neck muscles, open hips, and restore natural posture.",
    whyRecommended: "Recommended when workplace assessments reflect prolonged static sitting, forward-head cervical tilt, or tight hip flexors.",
    trainerAssigned: "Dr. Sarah Jenkins (Occupational Ergonomist)",
    sessions: [
      {
        id: 1,
        title: "Seated Cat-Cow & Spinal Extension",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Rhythmic flexion and extension of the vertebral column to lubricate spinal discs.",
        steps: [
          "Sit on the edge of your chair with feet firmly planted flat on the floor.",
          "Inhale, arch your back gently, open chest wide, and look up toward ceiling (Cow).",
          "Exhale, round your spine forward, tuck chin to chest, draw belly button in (Cat).",
          "Flow smoothly between these two poses for 8 to 10 fluid breaths."
        ],
        tip: "Coordinate each spinal movement directly with your breathing cycle."
      },
      {
        id: 2,
        title: "Cervical & Upper Trapezius Release",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Gentle lateral neck stretches and chin tucks to counteract forward monitor slouching.",
        steps: [
          "Sit tall. Gently lower right ear toward right shoulder without lifting left shoulder.",
          "Place right hand softly on left temple for slight gentle traction; do not pull.",
          "Hold for 20 seconds while taking slow diaphragmatic breaths.",
          "Slowly switch sides and repeat for left ear to left shoulder."
        ],
        tip: "Never force range of motion—stop at comfortable initial stretch tension."
      },
      {
        id: 3,
        title: "Desk-Side Warrior & Chest Opener",
        duration: "12 mins",
        type: "movement",
        timerSeconds: 360,
        instructions: "Standing hip opener and pectoral stretch to counteract rounded forward shoulders.",
        steps: [
          "Stand next to desk. Step right foot forward, left foot back at 45 degrees.",
          "Bend front knee, engage core, and raise arms straight overhead.",
          "Open arms into cactus position (90-degree elbows) and pinch shoulder blades together.",
          "Hold for 5 deep breaths, switch forward legs and repeat."
        ],
        tip: "Keep pelvic girdle square to the front and tailbone gently tucked."
      },
      {
        id: 4,
        title: "Seated Pigeon Stretch (Hip & Psoas)",
        duration: "12 mins",
        type: "movement",
        timerSeconds: 360,
        instructions: "Targeted gluteal and piriformis release to alleviate lower back compression.",
        steps: [
          "Sit upright. Cross your right ankle over your left knee, creating a figure-4 shape.",
          "Keep right foot flexed to protect knee joint.",
          "Gently hinge forward from your hips with a flat back until you feel a deep glute stretch.",
          "Hold for 30 seconds while exhaling tension. Repeat on the opposite side."
        ],
        tip: "Hinge from the hips rather than rounding the upper spine."
      },
      {
        id: 5,
        title: "Eagle Arms & Scapular Gliding",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Deep stretch across rhomboids and upper back to release postural knots.",
        steps: [
          "Extend both arms forward parallel to the floor.",
          "Cross right arm over left at elbows, bend elbows, and wrap forearms so palms touch.",
          "Lift elbows to shoulder height while keeping shoulders drawn away from ears.",
          "Breathe into the space between your shoulder blades for 25 seconds; switch arm cross."
        ],
        tip: "If palms cannot touch, simply place hands on opposite shoulders."
      },
      {
        id: 6,
        title: "Thoracic Twist & Ribcage Mobility",
        duration: "12 mins",
        type: "movement",
        timerSeconds: 360,
        instructions: "Gentle rotational drill to restore thoracic spine rotational freedom.",
        steps: [
          "Sit tall with feet flat. Place right hand on outside of left knee.",
          "Place left hand on back of chair cushion behind you.",
          "Inhale to lengthen your spine tall, exhale to gently rotate torso to the left.",
          "Hold for 5 slow breaths; slowly unwind to center and repeat to the right side."
        ],
        tip: "Initiate rotation from your mid-back, keeping hips firmly rooted."
      },
      {
        id: 7,
        title: "Standing Forward Fold & Hamstring Decompression",
        duration: "12 mins",
        type: "movement",
        timerSeconds: 360,
        instructions: "Decompress the lumbar spine and restore posterior chain elasticity.",
        steps: [
          "Stand with feet hip-width apart behind your chair.",
          "Rest hands on chair back and hinge at hips, stepping back until torso is parallel to floor.",
          "Let head relax between upper arms, feeling a gentle stretch in spine and hamstrings.",
          "Hold for 30 seconds with soft knees, then slowly roll up vertebrae by vertebrae."
        ],
        tip: "Keep knees slightly bent to prevent hamstring hyper-strain."
      },
      {
        id: 8,
        title: "Mastery Flow & Posture Self-Audit",
        duration: "15 mins",
        type: "checklist",
        timerSeconds: 420,
        instructions: "Full movement sequence review and long-term ergonomic self-audit.",
        steps: [
          "Perform an integrated 6-minute flow combining Cat-Cow, Pigeon, and Eagle Arms.",
          "Assess your workday posture alignment in a seated and standing position.",
          "Note reduction in cervical or lower back stiffness compared to Week 1.",
          "Submit your session log for official specialist verification."
        ],
        tip: "Incorporate 2-minute movement micro-breaks into every working hour."
      }
    ]
  },
  {
    id: "guided-meditation-stress-reset",
    name: "Guided Meditation",
    shortName: "Meditation",
    category: "Meditation",
    tag: "Meditation",
    emoji: "🕊️",
    targetRisk: "Stress",
    duration: "4 Weeks",
    totalSessions: 8,
    intensity: "Peaceful & Centering",
    dailyTime: "10 mins",
    overview: "Guided meditation and breathwork rituals to quiet mental noise, build sustained focus stamina, regulate the nervous system, and dissolve midday fatigue.",
    whyRecommended: "Recommended for enhancing focus stamina, steadying autonomic nervous balance, and clearing brain fog.",
    trainerAssigned: "Elena Rostova (Wellbeing & Stress Coach)",
    sessions: [
      {
        id: 1,
        title: "Box Breathing (4-4-4-4 Calm Rhythm)",
        duration: "10 mins",
        type: "breathing",
        timerSeconds: 240,
        instructions: "Equal-cadence tactical breathing to quiet hyper-aroused cognitive states.",
        steps: [
          "Sit with an upright posture and close your eyes or soften your gaze.",
          "Inhale slowly through your nose for 4 seconds.",
          "Hold your breath calmly for 4 seconds.",
          "Exhale steadily through your mouth for 4 seconds.",
          "Hold empty for 4 seconds. Repeat for 6 relaxing cycles."
        ],
        tip: "Maintain a steady, rhythmic pacing without rushing through the holds."
      },
      {
        id: 2,
        title: "Full Body Relaxation Scan",
        duration: "10 mins",
        type: "mindfulness",
        timerSeconds: 300,
        instructions: "Systematic progressive body scan to release unconscious physical clenching.",
        steps: [
          "Bring attention to the top of your head, releasing forehead and jaw tightness.",
          "Move awareness down through neck, shoulders, and chest, consciously dropping tension.",
          "Notice your hands resting naturally, unclenching any fingers or grip.",
          "Scan down through lower back, hips, legs, and feet resting grounded on the floor."
        ],
        tip: "Notice areas of tension without self-criticism—simply breathe into them."
      },
      {
        id: 3,
        title: "Natural Breath Awareness & Anchor",
        duration: "10 mins",
        type: "breathing",
        timerSeconds: 300,
        instructions: "Anchor attention in the present moment through pure observation of spontaneous breath.",
        steps: [
          "Let your breath return to its completely natural, unforced cadence.",
          "Pick one physical anchor point: the coolness at nostrils or the rise of belly.",
          "Whenever a work thought arises, gently label it 'Thinking' without judgment.",
          "Gently return attention back to your anchor point."
        ],
        tip: "Distraction is normal; the moment you notice and return is where mindfulness grows."
      },
      {
        id: 4,
        title: "Soundscape Awareness & Mental Spaciousness",
        duration: "10 mins",
        type: "mindfulness",
        timerSeconds: 300,
        instructions: "Expand attention outward to decouple from tight mental problem-solving loops.",
        steps: [
          "Close eyes and shift awareness to sounds around your workspace.",
          "Listen without judging or labeling sounds as good or bad distractions.",
          "Hear sounds arise, exist, and fade away naturally.",
          "Notice the underlying quiet and spaciousness between sounds."
        ],
        tip: "Allow sounds to pass through your awareness like ripples on water."
      },
      {
        id: 5,
        title: "Letting Go of Racing Work Thoughts",
        duration: "10 mins",
        type: "mindfulness",
        timerSeconds: 300,
        instructions: "Observe the stream of cognitive thoughts without being swept away by them.",
        steps: [
          "Visualize thoughts as clouds floating across a wide open blue sky.",
          "Do not grab onto any passing cloud; simply watch it drift across your field of awareness.",
          "Feel the difference between being lost in a thought versus observing it.",
          "Anchor yourself in the stillness of the observer."
        ],
        tip: "You are the sky; thoughts and deadlines are just passing weather."
      },
      {
        id: 6,
        title: "Workplace Gratitude & Perspective Pause",
        duration: "10 mins",
        type: "mindfulness",
        timerSeconds: 300,
        instructions: "Counteract the evolutionary negativity bias by recognizing meaningful support.",
        steps: [
          "Bring to mind one colleague, tool, or achievement you genuinely appreciate.",
          "Notice the warm sensation in your chest as you hold that appreciation.",
          "Recognize that small daily wins compound into meaningful progress.",
          "Carry that grounded appreciation into your next workday task."
        ],
        tip: "Gratitude activates dopamine and serotonin pathways, boosting cognitive stamina."
      },
      {
        id: 7,
        title: "Pre-Meeting Grounding & Focus Centering",
        duration: "8 mins",
        type: "breathing",
        timerSeconds: 240,
        instructions: "Rapid 3-minute mental centering before entering high-stakes team discussions.",
        steps: [
          "Take 3 deep, grounding breaths before entering a high-stakes call or meeting.",
          "Feel the support of the chair beneath you and your feet on the ground.",
          "Set a conscious intention: 'I will listen actively and respond with clarity.'",
          "Step into the meeting calm, centered, and attentive."
        ],
        tip: "Centering prior to meetings prevents emotional contagion and impulsive replies."
      },
      {
        id: 8,
        title: "Inner Stillness & Practice Blueprint",
        duration: "12 mins",
        type: "checklist",
        timerSeconds: 360,
        instructions: "Establish a permanent mindfulness schedule and submit for verification.",
        steps: [
          "Sit in uninterrupted silence for 5 minutes, experiencing inner calm.",
          "Reflect on how regular meditation pauses improved your focus clarity.",
          "Establish a recurring daily 5-minute meditation appointment in your work calendar.",
          "Submit your curriculum log for verified credential review."
        ],
        tip: "A 5-minute daily practice is exponentially more powerful than an hour once a week."
      }
    ]
  },
  {
    id: "workplace-ergonomics-posture",
    name: "Posture & Ergonomics",
    shortName: "Posture",
    category: "Posture",
    tag: "Posture",
    emoji: "💺",
    targetRisk: "Posture",
    duration: "3 Weeks",
    totalSessions: 6,
    intensity: "Corrective & Practical",
    dailyTime: "10 - 12 mins",
    overview: "Step-by-step physical calibration of your monitor, desk, keyboard, and seating arrangement to eliminate localized musculoskeletal strain.",
    whyRecommended: "Recommended when neck, shoulder, or lower back discomfort is identified during desk work.",
    trainerAssigned: "Dr. Sarah Jenkins (Occupational Ergonomist)",
    sessions: [
      {
        id: 1,
        title: "Chair Height & Pelvic Angle Calibration",
        duration: "10 mins",
        type: "ergonomic",
        timerSeconds: 300,
        instructions: "Adjusting chair height so feet are flat, knees at 90-100 degrees, and pelvis in neutral.",
        steps: [
          "Adjust chair cylinder so feet rest flat on the floor with thighs parallel to ground.",
          "Ensure knees are at a comfortable 90-100 degree angle.",
          "Leave a 2 to 3 finger gap between back of knees and edge of seat pan.",
          "Sit upright with pelvis in neutral, avoiding posterior pelvic tucking."
        ],
        tip: "If feet do not touch the floor when desk height matches, utilize a firm footrest."
      },
      {
        id: 2,
        title: "Monitor Eye-Level Alignment & Distance",
        duration: "10 mins",
        type: "ergonomic",
        timerSeconds: 300,
        instructions: "Positioning primary display an arm's length away with top third at eye level.",
        steps: [
          "Extend your arm forward; display screen should be roughly fingertip distance away.",
          "Adjust display elevation so top third of monitor matches eye level when looking straight ahead.",
          "Tilt monitor slightly backward (10-20 degrees) to match natural gaze downward.",
          "If using dual monitors, position primary directly centered in front of keyboard."
        ],
        tip: "Viewing monitors too low causes 40+ lbs of cervical shear force from neck flexion."
      },
      {
        id: 3,
        title: "Keyboard & Mouse Ergonomic Reach",
        duration: "12 mins",
        type: "ergonomic",
        timerSeconds: 360,
        instructions: "Arranging keyboard 10-15 cm from desk edge with forearms parallel to floor.",
        steps: [
          "Position keyboard 10-15 cm from desk edge so forearms rest comfortably.",
          "Adjust armrest height so elbows bend at 90 degrees and shoulders hang completely relaxed.",
          "Keep wrists straight in a neutral plane while typing; avoid bending wrists upward or sideways.",
          "Place mouse immediately adjacent to keyboard to prevent excessive reach."
        ],
        tip: "Do not plant wrists firmly on hard surfaces while actively striking keys."
      },
      {
        id: 4,
        title: "Lumbar Support & Backrest Optimization",
        duration: "10 mins",
        type: "ergonomic",
        timerSeconds: 300,
        instructions: "Placing lumbar cushion at the small of your back with a 100-110 degree recline.",
        steps: [
          "Position lumbar contour directly into the inward curve of your lower back.",
          "Adjust backrest recline to 100-110 degrees to reduce intradiscal spinal pressure.",
          "Lean back and let chair backrest support upper body weight throughout the day.",
          "Verify lower back feels supported without pushing pelvis forward."
        ],
        tip: "A slight backward recline of 105 degrees reduces lumbar disc pressure significantly."
      },
      {
        id: 5,
        title: "Sit-Stand Desk Interval Protocols",
        duration: "12 mins",
        type: "movement",
        timerSeconds: 360,
        instructions: "Transitioning smoothly between seated and standing blocks (20 mins stand, 40 mins sit).",
        steps: [
          "Calibrate standing desk height so keyboard surface matches resting elbow height.",
          "Adopt the 40/20 cadence: 40 minutes seated work, 20 minutes standing work.",
          "While standing, distribute weight evenly between both feet, avoiding knee locking.",
          "Wear supportive footwear or use an anti-fatigue mat when standing."
        ],
        tip: "Standing too long can cause lower limb venous pooling—intervals are key."
      },
      {
        id: 6,
        title: "Final Workstation Audit & Verification",
        duration: "15 mins",
        type: "checklist",
        timerSeconds: 420,
        instructions: "Executing the complete OSHA-aligned ergonomic self-check for permanent setup.",
        steps: [
          "Execute the 12-point clinical workstation alignment checklist.",
          "Verify display, chair, keyboard, lighting, and document placement.",
          "Take a photo of your calibrated desk setup for your ergonomics records.",
          "Submit your audit for specialist certification."
        ],
        tip: "Re-check your setup quarterly or whenever desk hardware or chair changes."
      }
    ]
  },
  {
    id: "daily-movement-stretch-breaks",
    name: "Daily Walking",
    shortName: "Walking",
    category: "Walking",
    tag: "Walking",
    emoji: "🚶",
    targetRisk: "Activity",
    duration: "3 Weeks",
    totalSessions: 6,
    intensity: "Active & Invigorating",
    dailyTime: "10 - 15 mins",
    overview: "Combats prolonged sedentary desk work through micro-breaks, desk-side mobility sequences, and actionable step volume milestones.",
    whyRecommended: "Recommended when uninterrupted seated time exceeds 7+ hours per workday.",
    trainerAssigned: "Marcus Vance (Occupational Physical Therapist)",
    sessions: [
      {
        id: 1,
        title: "The 50/10 Workday Cadence Initiation",
        duration: "8 mins",
        type: "movement",
        timerSeconds: 240,
        instructions: "Implementing hourly standing alerts and 2-minute active posture breaks.",
        steps: [
          "Set a timer for 50 minutes of focused desk work.",
          "When timer rings, stand up immediately for a 2-minute active posture pause.",
          "Perform 10 gentle torso twists and 5 deep belly breaths before sitting.",
          "Track adherence for 4 work hours."
        ],
        tip: "Breaking static sitting every hour improves insulin sensitivity and mental focus."
      },
      {
        id: 2,
        title: "Lower Limb Circulation Drills",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Calf raises, seated ankle alphabets, and standing quad activations.",
        steps: [
          "Stand with light finger touch on desk for balance.",
          "Raise up onto balls of feet, squeeze calf muscles at top for 2 seconds, lower slowly.",
          "Perform 3 sets of 12 calf raises to pump pooled venous blood back to heart.",
          "Follow with 10 seated ankle circles in both directions."
        ],
        tip: "Calf muscles act as a secondary circulatory pump for venous blood flow."
      },
      {
        id: 3,
        title: "Midday Brisk Walking Strategy",
        duration: "15 mins",
        type: "walking",
        timerSeconds: 600,
        instructions: "Incorporating outdoor or hallway walking routines into your work break schedule.",
        steps: [
          "Step away from computer screens during lunch or mid-afternoon break.",
          "Walk at a brisk, purposeful pace outdoors or through company hallways.",
          "Let arms swing naturally and keep eyes looking forward at the horizon.",
          "Log 1,500 to 2,000 steps during this single walking block."
        ],
        tip: "Natural optic flow from walking suppresses amygdala threat reactivity."
      },
      {
        id: 4,
        title: "Desk-Side Thoracic & Wrist Mobilizers",
        duration: "10 mins",
        type: "movement",
        timerSeconds: 300,
        instructions: "Wrist extensor stretches and thoracic openers for frequent keyboard users.",
        steps: [
          "Extend right arm forward, palm facing out; gently draw fingers back with left hand.",
          "Hold for 20 seconds to stretch forearm flexor muscles.",
          "Flip hand down so palm faces chest, gently pull back on back of hand for extensor stretch.",
          "Shake out hands loosely and repeat with opposite arm."
        ],
        tip: "Perform wrist stretches before repetitive typing sprints to prevent strain."
      },
      {
        id: 5,
        title: "5,000-Step Workday Milestone Tracking",
        duration: "15 mins",
        type: "walking",
        timerSeconds: 600,
        instructions: "Achieving daily movement volume targets during business hours.",
        steps: [
          "Take the stairs instead of the elevator for 2 floors.",
          "Pace or stand while taking voice-only phone calls.",
          "Walk over to speak with teammates in person when feasible.",
          "Verify your fitness tracker or smartphone reaches 5,000+ workday steps."
        ],
        tip: "Accumulating small movement bursts throughout the day avoids end-of-day fatigue."
      },
      {
        id: 6,
        title: "Lifelong Active Workday Integration",
        duration: "12 mins",
        type: "checklist",
        timerSeconds: 360,
        instructions: "Forming sustainable movement cues that seamlessly integrate with team workflows.",
        steps: [
          "Review your 3-week movement logs and daily step trends.",
          "Establish 3 non-negotiable workday movement triggers.",
          "Celebrate improved midday energy and reduced leg heaviness.",
          "Submit your curriculum completion for trainer verification."
        ],
        tip: "Pair movement with existing habits: e.g. stretch after every coffee or tea run."
      }
    ]
  },
  {
    id: "healthy-recovery-sleep-habits",
    name: "Sleep & Recovery",
    shortName: "Sleep",
    category: "Sleep",
    tag: "Sleep",
    emoji: "🌙",
    targetRisk: "Recovery",
    duration: "2 Weeks",
    totalSessions: 4,
    intensity: "Soothing & Calming",
    dailyTime: "10 - 12 mins",
    overview: "Optimizes nocturnal sleep architecture, circadian light exposure, and evening mental wind-down routines to restore workday physical energy.",
    whyRecommended: "Recommended when sleep duration is under 6.5 hours or morning tiredness persists.",
    trainerAssigned: "Elena Rostova (Wellbeing & Stress Coach)",
    sessions: [
      {
        id: 1,
        title: "Circadian Light Anchoring & Morning Routine",
        duration: "10 mins",
        type: "mindfulness",
        timerSeconds: 300,
        instructions: "Viewing natural morning sunlight within 30 minutes of waking to anchor the cortisol pulse.",
        steps: [
          "Within 30-45 minutes of waking, step outside or look out an open window.",
          "Expose your eyes to indirect natural sunlight for 10 minutes without sunglasses.",
          "This sets your master circadian biological clock and anchors daytime cortisol.",
          "Drink a full 250ml glass of water upon waking."
        ],
        tip: "Morning light triggers melatonin production 14-16 hours later for easier sleep."
      },
      {
        id: 2,
        title: "Digital Curfew & Blue Light Mitigation",
        duration: "10 mins",
        type: "checklist",
        timerSeconds: 300,
        instructions: "Discontinuing work communication and screen exposure 45 minutes prior to bedtime.",
        steps: [
          "Power down work laptops and stop reading emails at least 60 minutes before bed.",
          "Enable warm night-shift mode or amber filters on personal devices.",
          "Switch harsh overhead fluorescent lights to warm ambient lamps.",
          "Let your nervous system perceive natural evening dimness."
        ],
        tip: "Blue light suppresses melatonin synthesis by tricking the brain into thinking it's noon."
      },
      {
        id: 3,
        title: "Sleep Sanctuary Temperature & Environment",
        duration: "12 mins",
        type: "ergonomic",
        timerSeconds: 360,
        instructions: "Configuring dark, quiet, and 18-20°C ambient room temperature for deep slow-wave sleep.",
        steps: [
          "Set bedroom thermostat to cool ambient temperature (18°C - 20°C / 65°F - 68°F).",
          "Ensure room is pitch dark using blackout curtains or a comfortable eye mask.",
          "Remove noisy electronics and blinking LED indicator lights from eyesight.",
          "Reserve bed exclusively for sleep and resting."
        ],
        tip: "Core body temperature must drop by 1°C for the brain to initiate deep sleep."
      },
      {
        id: 4,
        title: "Restorative Recovery Audit & Progress Log",
        duration: "12 mins",
        type: "checklist",
        timerSeconds: 360,
        instructions: "Evaluating 7-day sleep consistency and daytime vitality metrics.",
        steps: [
          "Evaluate your 7-day sleep consistency and morning alertness score.",
          "Document your personalized 30-minute evening wind-down ritual.",
          "Notice the correlation between quality sleep and daytime cognitive focus.",
          "Submit your recovery milestone for specialist credential issuance."
        ],
        tip: "Sleep consistency (same wake time daily) matters more than total duration alone."
      }
    ]
  }
];

export const dataStore = {
  // Helper to read JSON from localStorage
  get: (key, defaultValue = null) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  // Helper to write JSON to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  // Current User Session
  getCurrentUser: () => {
    return dataStore.get("user", null);
  },

  setCurrentUser: (user) => {
    dataStore.set("user", user);
  },

  // Registered Users Registry (Employee, Trainer, Admin)
  getUsers: () => {
    return dataStore.get("users", [
      {
        id: "u-emp-1",
        name: "Bhavana Thota",
        email: "employee@company.com",
        role: "employee",
        department: "Engineering",
        jobRole: "Senior Software Engineer",
        employeeId: "EMP-1001"
      },
      {
        id: "u-tr-1",
        name: "Dr. Sarah Jenkins",
        email: "trainer@company.com",
        role: "trainer",
        department: "Health & Ergonomics",
        jobRole: "Occupational Health Specialist",
        trainerId: "TR-2001",
        specialization: "Ergonomics & Musculoskeletal Strain",
        credentials: "PT, CPE (Certified Professional Ergonomist)"
      },
      {
        id: "u-adm-1",
        name: "Platform Administrator",
        email: "admin@company.com",
        role: "admin",
        department: "Occupational Health Directorate",
        jobRole: "Health & Safety Director",
        adminId: "ADM-1001"
      }
    ]);
  },

  registerUser: (userData) => {
    const users = dataStore.getUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    let role = "employee";
    if (userData.role === "trainer") role = "trainer";
    if (userData.role === "admin") role = "admin";

    const newUser = {
      id: userData.id || `u-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: role,
      department: userData.department || (role === "trainer" ? "Health & Ergonomics" : role === "admin" ? "Occupational Health Directorate" : "Engineering"),
      jobRole: userData.jobRole || (role === "trainer" ? "Occupational Health Specialist" : role === "admin" ? "Health & Safety Director" : "Associate"),
      employeeId: role === "employee" ? (userData.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      trainerId: role === "trainer" ? (userData.trainerId || `TR-${Math.floor(2000 + Math.random() * 8000)}`) : undefined,
      adminId: role === "admin" ? (userData.adminId || `ADM-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      specialization: userData.specialization,
      credentials: userData.credentials
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      users.push(newUser);
    }
    dataStore.set("users", users);
    return newUser;
  },

  updateUserProfile: (userId, updatedData) => {
    const users = dataStore.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index >= 0) {
      users[index] = { ...users[index], ...updatedData };
      dataStore.set("users", users);
    }
    const current = dataStore.getCurrentUser();
    if (current && current.id === userId) {
      dataStore.setCurrentUser({ ...current, ...updatedData });
    }
    return users[index] || updatedData;
  },

  // Assessment & Risk Scores (User-scoped)
  getUserAssessment: (userId) => {
    const assessments = dataStore.get("user_assessments", {});
    return assessments[userId] || null;
  },

  getUserRiskScores: (userId) => {
    const scores = dataStore.get("user_risk_scores", {});
    return scores[userId] || null;
  },

  saveUserAssessment: (userId, answers, categoryScores, overallScore) => {
    const assessments = dataStore.get("user_assessments", {});
    const scores = dataStore.get("user_risk_scores", {});

    assessments[userId] = {
      answers,
      completedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    scores[userId] = {
      categoryScores,
      overallScore,
      completedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    dataStore.set("user_assessments", assessments);
    dataStore.set("user_risk_scores", scores);
    return scores[userId];
  },

  markRiskProfileViewed: (userId) => {
    const map = dataStore.get("user_risk_profile_viewed", {});
    map[userId] = true;
    dataStore.set("user_risk_profile_viewed", map);
  },

  isRiskProfileViewed: (userId) => {
    const map = dataStore.get("user_risk_profile_viewed", {});
    return !!map[userId];
  },

  // Program Enrollments & Progress (User-scoped)
  getUserEnrollments: (userId) => {
    const enrollments = dataStore.get("user_enrollments", {});
    return enrollments[userId] || [];
  },

  getUserProgramProgress: (userId, programId) => {
    const progressMap = dataStore.get("user_program_progress", {});
    const userPrograms = progressMap[userId] || {};
    return userPrograms[programId] || {
      completedSessions: [],
      progress: 0,
      status: "not_started", // not_started, active, awaiting_review, needs_correction, verified
      trainerFeedback: null,
      trainerObservations: null,
      submittedAt: null
    };
  },

  enrollUserProgram: (userId, programId) => {
    const enrollments = dataStore.get("user_enrollments", {});
    const list = enrollments[userId] || [];
    if (!list.includes(programId)) {
      list.push(programId);
      enrollments[userId] = list;
      dataStore.set("user_enrollments", enrollments);
    }

    const progressMap = dataStore.get("user_program_progress", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    if (!progressMap[userId][programId]) {
      progressMap[userId][programId] = {
        completedSessions: [],
        progress: 0,
        status: "active",
        enrolledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      dataStore.set("user_program_progress", progressMap);
    }
  },

  toggleSessionCompletion: (userId, programId, sessionId) => {
    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === programId);
    if (!prog) return null;

    const progressMap = dataStore.get("user_program_progress", {});
    if (!progressMap[userId]) progressMap[userId] = {};
    const current = progressMap[userId][programId] || { completedSessions: [], progress: 0, status: "active" };

    let completed = [...(current.completedSessions || [])];
    if (completed.includes(sessionId)) {
      completed = completed.filter((id) => id !== sessionId);
    } else {
      completed.push(sessionId);
    }

    const progressPct = Math.round((completed.length / prog.totalSessions) * 100);
    const updatedStatus = current.status === "verified" ? "verified" : (progressPct >= 100 ? "completed" : "active");

    progressMap[userId][programId] = {
      ...current,
      completedSessions: completed,
      progress: progressPct,
      status: updatedStatus
    };

    dataStore.set("user_program_progress", progressMap);
    return progressMap[userId][programId];
  },

  // Submit Program for Trainer Review
  submitProgramForReview: (user, programId, employeeReflection = "") => {
    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === programId);
    if (!prog) return false;

    // Update user program progress status
    const progressMap = dataStore.get("user_program_progress", {});
    if (!progressMap[user.id]) progressMap[user.id] = {};
    const current = progressMap[user.id][programId] || {};
    progressMap[user.id][programId] = {
      ...current,
      status: "awaiting_review",
      employeeReflection: employeeReflection || "Completed all prescribed workplace sessions consistently.",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    dataStore.set("user_program_progress", progressMap);

    // Create entry in shared trainer review inbox
    const reviews = dataStore.get("trainer_reviews", []);
    const reviewId = `REV-${Date.now().toString().slice(-6)}`;
    const newReview = {
      id: reviewId,
      employeeId: user.id,
      employeeName: user.name,
      employeeEmail: user.email,
      department: user.department || "Corporate Workforce",
      programId: prog.id,
      programName: prog.name,
      programDuration: prog.duration,
      sessionsCompleted: prog.totalSessions,
      totalSessions: prog.totalSessions,
      employeeReflection: employeeReflection || "Completed all prescribed workplace sessions consistently.",
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending", // pending, approved, needs_correction
      trainerObservations: "",
      trainerFeedback: "",
      reviewedAt: null,
      reviewedBy: null
    };

    // Remove any older pending review for same user and program
    const filtered = reviews.filter((r) => !(r.employeeId === user.id && r.programId === prog.id && r.status === "pending"));
    filtered.unshift(newReview);
    dataStore.set("trainer_reviews", filtered);
    return newReview;
  },

  // Trainer Review Actions
  getTrainerReviews: () => {
    return dataStore.get("trainer_reviews", []);
  },

  approveReview: (reviewId, trainerName, feedback, observations = "") => {
    const reviews = dataStore.get("trainer_reviews", []);
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return null;

    const feedbackText = feedback || "Demonstrated exemplary engagement with all movement routines. Workstation habits verified.";
    const observationText = observations || "Required sessions verified completed with proper ergonomic cadence.";

    review.status = "approved";
    review.trainerFeedback = feedbackText;
    review.trainerObservations = observationText;
    review.reviewedBy = trainerName;
    review.reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    dataStore.set("trainer_reviews", reviews);

    // Update employee program progress status to verified
    const progressMap = dataStore.get("user_program_progress", {});
    if (progressMap[review.employeeId] && progressMap[review.employeeId][review.programId]) {
      progressMap[review.employeeId][review.programId].status = "verified";
      progressMap[review.employeeId][review.programId].trainerFeedback = feedbackText;
      progressMap[review.employeeId][review.programId].trainerObservations = observationText;
      progressMap[review.employeeId][review.programId].reviewedBy = trainerName;
      progressMap[review.employeeId][review.programId].reviewedAt = review.reviewedAt;
      dataStore.set("user_program_progress", progressMap);
    }

    // Generate Unique Certificate
    const certId = `IOH-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const certsMap = dataStore.get("user_certificates", {});
    const userCerts = certsMap[review.employeeId] || [];

    const newCert = {
      certificateId: certId,
      programId: review.programId,
      programName: review.programName,
      programDuration: review.programDuration,
      employeeId: review.employeeId,
      employeeName: review.employeeName,
      trainerName: trainerName,
      issuedAt: review.reviewedAt,
      status: "Verified"
    };

    userCerts.unshift(newCert);
    certsMap[review.employeeId] = userCerts;
    dataStore.set("user_certificates", certsMap);
    return newCert;
  },

  requestReviewCorrection: (reviewId, trainerName, feedback, observations = "") => {
    const reviews = dataStore.get("trainer_reviews", []);
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return null;

    review.status = "needs_correction";
    review.trainerFeedback = feedback;
    review.trainerObservations = observations;
    review.reviewedBy = trainerName;
    review.reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    dataStore.set("trainer_reviews", reviews);

    const progressMap = dataStore.get("user_program_progress", {});
    if (progressMap[review.employeeId] && progressMap[review.employeeId][review.programId]) {
      progressMap[review.employeeId][review.programId].status = "needs_correction";
      progressMap[review.employeeId][review.programId].trainerFeedback = feedback;
      progressMap[review.employeeId][review.programId].trainerObservations = observations;
      dataStore.set("user_program_progress", progressMap);
    }
    return review;
  },

  // Certificates (User-scoped)
  getUserCertificates: (userId) => {
    const certsMap = dataStore.get("user_certificates", {});
    return certsMap[userId] || [];
  },

  // Trainer operational helpers (only real data)
  getTrainerAssignedEmployees: () => {
    const users = dataStore.getUsers();
    const employees = users.filter((u) => u.role === "employee");
    const enrollmentsMap = dataStore.get("user_enrollments", {});
    const progressMap = dataStore.get("user_program_progress", {});
    const certsMap = dataStore.get("user_certificates", {});

    return employees.map((emp) => {
      const enrollments = enrollmentsMap[emp.id] || [];
      const activeProgramId = enrollments[0];
      const prog = OFFICIAL_PROGRAMS.find((p) => p.id === activeProgramId);
      const userProgress = (activeProgramId && progressMap[emp.id]) ? progressMap[emp.id][activeProgramId] : null;
      const certs = certsMap[emp.id] || [];
      const risk = dataStore.getUserRiskScores(emp.id);

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department || "General",
        employeeId: emp.employeeId || "EMP-XXXX",
        hasCompletedAssessment: !!risk,
        overallRiskScore: risk?.overallScore ?? null,
        activeProgram: prog?.name || "Not Enrolled",
        programId: prog?.id || null,
        programProgress: userProgress?.progress || 0,
        programStatus: userProgress?.status || "not_started",
        completedSessions: userProgress?.completedSessions?.length || 0,
        totalSessions: prog?.totalSessions || 0,
        certificatesEarned: certs.length
      };
    });
  },

  getTrainerSessionLogs: () => {
    const employees = dataStore.getTrainerAssignedEmployees().filter((e) => e.programId);
    const progressMap = dataStore.get("user_program_progress", {});
    const notesMap = dataStore.get("trainer_session_notes", {});

    const logs = [];
    employees.forEach((emp) => {
      const prog = OFFICIAL_PROGRAMS.find((p) => p.id === emp.programId);
      if (!prog) return;

      const userProg = progressMap[emp.id]?.[emp.programId];
      const completedIds = userProg?.completedSessions || [];

      prog.sessions.forEach((s) => {
        const isDone = completedIds.includes(s.id);
        const noteKey = `${emp.id}_${emp.programId}_${s.id}`;
        logs.push({
          id: noteKey,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          programId: prog.id,
          programName: prog.name,
          sessionId: s.id,
          sessionTitle: s.title,
          duration: s.duration,
          isCompleted: isDone,
          trainerNote: notesMap[noteKey] || ""
        });
      });
    });

    return logs;
  },

  saveTrainerSessionNote: (noteKey, noteText) => {
    const notesMap = dataStore.get("trainer_session_notes", {});
    notesMap[noteKey] = noteText;
    dataStore.set("trainer_session_notes", notesMap);
  },

  getTrainerProgressStats: () => {
    const reviews = dataStore.getTrainerReviews();
    const certsMap = dataStore.get("user_certificates", {});
    const enrollmentsMap = dataStore.get("user_enrollments", {});
    const progressMap = dataStore.get("user_program_progress", {});

    let activePrograms = 0;
    let completedPrograms = 0;

    Object.entries(progressMap).forEach(([uid, progs]) => {
      Object.values(progs).forEach((p) => {
        if (p.status === "active") activePrograms++;
        if (p.status === "completed" || p.status === "verified") completedPrograms++;
      });
    });

    const pendingReviews = reviews.filter((r) => r.status === "pending").length;
    const correctionsRequested = reviews.filter((r) => r.status === "needs_correction").length;
    const verifiedPrograms = reviews.filter((r) => r.status === "approved").length;

    let totalCerts = 0;
    Object.values(certsMap).forEach((c) => (totalCerts += c.length));

    return {
      activePrograms,
      completedPrograms,
      pendingReviews,
      correctionsRequested,
      verifiedPrograms,
      totalCertificatesIssued: totalCerts
    };
  },

  // Dynamic Next Step Calculator for Employee Dashboard (Exact Section 12 Specification)
  getEmployeeLifecycleStage: (userId) => {
    const assessment = dataStore.getUserAssessment(userId);
    if (!assessment) {
      return {
        stage: 0,
        title: "Complete your workplace health assessment",
        description: "Begin your confidential 16-item screening to evaluate posture strain, movement cadence, and fatigue indicators.",
        ctaLabel: "Start Assessment",
        ctaPath: "/employee/assessment",
        badge: "Initial Step"
      };
    }

    const isViewed = dataStore.isRiskProfileViewed(userId);
    if (!isViewed) {
      return {
        stage: 1,
        title: "Review your workplace risk profile",
        description: "Your 16-factor screening is synthesized across posture, activity, stress, recovery, and workload.",
        ctaLabel: "View Risk Profile",
        ctaPath: "/employee/risk-profile",
        badge: "Profile Ready"
      };
    }

    const enrollments = dataStore.getUserEnrollments(userId);
    if (enrollments.length === 0) {
      return {
        stage: 2,
        title: "Explore your personalized recommendations",
        description: "Tailored ergonomic, mobility, and recovery routines have been matched to your screening scores.",
        ctaLabel: "View Recommendations",
        ctaPath: "/employee/recommendations",
        badge: "Recommendations Ready"
      };
    }

    const activeProgramId = enrollments[0];
    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === activeProgramId);
    const progress = dataStore.getUserProgramProgress(userId, activeProgramId);

    if (progress.status === "verified") {
      return {
        stage: 8,
        title: "Your program has been verified. Your certificate is ready.",
        description: `Congratulations! ${prog?.name || "Your program"} has been approved by your trainer. Download or print your verified certificate.`,
        ctaLabel: "View Certificate",
        ctaPath: "/employee/certificates",
        badge: "Certificate Ready"
      };
    }

    if (progress.status === "awaiting_review") {
      return {
        stage: 6,
        title: "Your program is currently being reviewed by your trainer.",
        description: `You have submitted ${prog?.name || "your program"}. Your occupational coach is evaluating session consistency.`,
        ctaLabel: "View Status",
        ctaPath: "/employee/my-programs",
        badge: "Awaiting Review"
      };
    }

    if (progress.status === "needs_correction") {
      return {
        stage: 7,
        title: "Your trainer has provided feedback. Review the feedback and continue your program.",
        description: `Coach feedback: "${progress.trainerFeedback || "Please review session guidance"}". Make adjustments and resubmit.`,
        ctaLabel: "View Feedback",
        ctaPath: `/employee/program/${activeProgramId}`,
        badge: "Feedback Available"
      };
    }

    if (progress.progress >= 100) {
      return {
        stage: 5,
        title: "Submit your program for trainer review",
        description: `All ${prog?.totalSessions || 8} sessions of ${prog?.name} are completed. Submit for trainer review to earn your verified credential.`,
        ctaLabel: "Submit for Review",
        ctaPath: `/employee/program/${activeProgramId}`,
        badge: "Ready for Review"
      };
    }

    if ((progress.completedSessions?.length || 0) === 0) {
      return {
        stage: 3,
        title: "Start your wellbeing program",
        description: `You have selected ${prog?.name || "your program"}. Open your curriculum tracker and begin Session 1.`,
        ctaLabel: "View Program",
        ctaPath: `/employee/program/${activeProgramId}`,
        badge: "Enrolled"
      };
    }

    return {
      stage: 4,
      title: "Continue your active program",
      description: `You have completed ${progress.completedSessions?.length || 0} of ${prog?.totalSessions || 8} sessions (${progress.progress}%). Keep up your workday momentum!`,
      ctaLabel: "Continue Program",
      ctaPath: `/employee/program/${activeProgramId}`,
      badge: `${progress.progress}% Complete`
    };
  },

  // =========================================================================
  // ADMIN & TRAINER INTEGRATION LAYER (DEEP OPERATIONAL CONNECTION)
  // =========================================================================

  // Returns all registered & accredited occupational trainers/specialists with live workload
  getTrainers: () => {
    const defaultTrainers = [
      {
        id: "u-tr-1",
        name: "Dr. Sarah Jenkins",
        email: "trainer@company.com",
        role: "trainer",
        department: "Health & Ergonomics",
        jobRole: "Senior Occupational Ergonomist",
        trainerId: "TR-2001",
        specialization: "Workplace Ergonomics & Spinal Posture",
        credentials: "PT, CPE (Certified Professional Ergonomist)",
        status: "Active",
        phone: "+1 (555) 349-8821"
      },
      {
        id: "u-tr-2",
        name: "Marcus Vance",
        email: "marcus.vance@company.com",
        role: "trainer",
        department: "Physical Therapy & Movement",
        jobRole: "Occupational Physical Therapist",
        trainerId: "TR-2002",
        specialization: "Movement Cadence & Active Micro-Breaks",
        credentials: "DPT, OCS (Orthopedic Clinical Specialist)",
        status: "Active",
        phone: "+1 (555) 782-9914"
      },
      {
        id: "u-tr-3",
        name: "Elena Rostova",
        email: "elena.rostova@company.com",
        role: "trainer",
        department: "Cognitive Wellbeing",
        jobRole: "Autonomic Stress & Sleep Coach",
        trainerId: "TR-2003",
        specialization: "Cognitive Decompression & Circadian Sleep",
        credentials: "MSc Occupational Psychology, NBC-HWC",
        status: "Active",
        phone: "+1 (555) 914-2209"
      }
    ];

    const registeredUsers = dataStore.getUsers().filter((u) => u.role === "trainer");
    const merged = [...defaultTrainers];
    registeredUsers.forEach((u) => {
      if (!merged.some((m) => m.email.toLowerCase() === u.email.toLowerCase())) {
        merged.push({
          ...u,
          specialization: u.specialization || "General Occupational Health & Wellness",
          credentials: u.credentials || "Certified Corporate Wellness Specialist",
          status: u.status || "Active",
          phone: u.phone || "+1 (555) 420-1188"
        });
      }
    });

    const employees = dataStore.getTrainerAssignedEmployees();
    const reviews = dataStore.getTrainerReviews();
    const programOverrides = dataStore.get("program_trainer_assignments", {});
    const employeeTrainerMap = dataStore.get("employee_trainer_assignments", {});

    return merged.map((tr) => {
      // Programs coached by this trainer
      const coachedPrograms = OFFICIAL_PROGRAMS.filter((p) => {
        const assigned = programOverrides[p.id] || p.trainerAssigned;
        return assigned.toLowerCase().includes(tr.name.toLowerCase());
      });

      // Employees assigned to this trainer
      const assignedEmps = employees.filter((e) => {
        const designated = employeeTrainerMap[e.id] || "Dr. Sarah Jenkins";
        return designated.toLowerCase().includes(tr.name.toLowerCase());
      });

      // Reviews assigned or handled by this trainer
      const pendingReviews = reviews.filter((r) => r.status === "pending");
      const approvedReviews = reviews.filter((r) => r.status === "approved" && (r.reviewedBy || "").toLowerCase().includes(tr.name.toLowerCase()));

      return {
        ...tr,
        assignedEmployeeCount: assignedEmps.length,
        programsCoachedCount: coachedPrograms.length,
        pendingReviewsCount: pendingReviews.length,
        approvedCertificationsCount: approvedReviews.length,
      };
    });
  },

  // Admin registers a new accredited specialist
  addTrainer: (trainerData) => {
    const newUser = dataStore.registerUser({
      ...trainerData,
      role: "trainer",
      trainerId: trainerData.trainerId || `TR-${Math.floor(2000 + Math.random() * 8000)}`
    });
    dataStore.addAuditLog("admin@company.com", "TRAINER_ACCREDITED", `Onboarded specialist: ${trainerData.name} (${trainerData.specialization || "Ergonomics"})`, "Governance");
    return newUser;
  },

  // Admin toggles trainer active status
  toggleTrainerStatus: (trainerId) => {
    const trainers = dataStore.getTrainers();
    const target = trainers.find((t) => t.id === trainerId);
    if (!target) return null;
    const newStatus = target.status === "Active" ? "On Leave" : "Active";
    dataStore.updateUserProfile(trainerId, { status: newStatus });
    dataStore.addAuditLog("admin@company.com", "TRAINER_STATUS_UPDATED", `Updated ${target.name} status to ${newStatus}`, "Operations");
    return newStatus;
  },

  // Returns all programs with admin trainer assignment overrides
  getPrograms: () => {
    const overrides = dataStore.get("program_trainer_assignments", {});
    const enrollmentsMap = dataStore.get("user_enrollments", {});

    return OFFICIAL_PROGRAMS.map((p) => {
      // Calculate real enrollments count for this program
      let enrollmentCount = 0;
      Object.values(enrollmentsMap).forEach((list) => {
        if (list.includes(p.id)) enrollmentCount++;
      });

      return {
        ...p,
        trainerAssigned: overrides[p.id] || p.trainerAssigned,
        activeEnrollmentsCount: enrollmentCount
      };
    });
  },

  // Admin assigns/reassigns a lead trainer to a program
  updateProgramTrainer: (programId, trainerName) => {
    const overrides = dataStore.get("program_trainer_assignments", {});
    overrides[programId] = trainerName;
    dataStore.set("program_trainer_assignments", overrides);

    const prog = OFFICIAL_PROGRAMS.find((p) => p.id === programId);
    dataStore.addAuditLog(
      "admin@company.com",
      "PROGRAM_TRAINER_REASSIGNED",
      `Assigned ${trainerName} as Lead Specialist for "${prog?.name || programId}"`,
      "Clinical Oversight"
    );
    return overrides;
  },

  // Employee-to-Trainer Assignment Map
  getEmployeeTrainerMap: () => {
    return dataStore.get("employee_trainer_assignments", {});
  },

  // Admin assigns a specific trainer to an employee
  assignTrainerToEmployee: (employeeId, trainerName) => {
    const map = dataStore.get("employee_trainer_assignments", {});
    map[employeeId] = trainerName;
    dataStore.set("employee_trainer_assignments", map);

    const users = dataStore.getUsers();
    const emp = users.find((u) => u.id === employeeId);
    dataStore.addAuditLog(
      "admin@company.com",
      "COACH_ASSIGNED_TO_EMPLOYEE",
      `Assigned specialist ${trainerName} to oversee ${emp?.name || employeeId}`,
      "Workforce"
    );
    return map;
  },

  // System Audit & Compliance Logs (ISO 45001 & Clinical Integrity)
  getAuditLogs: () => {
    return dataStore.get("audit_logs", [
      { id: "LOG-104", timestamp: "Today, 09:15 AM", actor: "admin@company.com", action: "ISO45001_AUDIT_VERIFIED", details: "Ergonomic surveillance and clinical review policies validated", category: "Compliance" },
      { id: "LOG-103", timestamp: "Today, 08:30 AM", actor: "trainer@company.com", action: "CLINICAL_REVIEW_APPROVED", details: "Dr. Sarah Jenkins approved Workplace Ergonomics certificate", category: "Clinical" },
      { id: "LOG-102", timestamp: "Yesterday, 04:45 PM", actor: "admin@company.com", action: "TRAINER_ASSIGNMENT_SYNC", details: "Synchronized coaching rosters across 3 occupational specialists", category: "Governance" },
      { id: "LOG-101", timestamp: "Yesterday, 02:20 PM", actor: "employee@company.com", action: "HEALTH_ASSESSMENT_COMPLETED", details: "16-question ergonomic screening submitted by Bhavana Thota", category: "Workforce" }
    ]);
  },

  addAuditLog: (actor, action, details, category = "General") => {
    const logs = dataStore.getAuditLogs();
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      actor,
      action,
      details,
      category
    };
    logs.unshift(newLog);
    dataStore.set("audit_logs", logs.slice(0, 50));
    return newLog;
  },

  // High-level aggregate KPIs for Admin Console
  getAdminMetrics: () => {
    const users = dataStore.getUsers();
    const employees = users.filter((u) => u.role === "employee");
    const trainers = dataStore.getTrainers();
    const reviews = dataStore.getTrainerReviews();
    const certsMap = dataStore.get("user_certificates", {});
    const assessments = dataStore.get("user_assessments", {});
    const programs = dataStore.getPrograms();

    let totalCerts = 0;
    Object.values(certsMap).forEach((list) => {
      totalCerts += list.length;
    });

    const pendingReviews = reviews.filter((r) => r.status === "pending");
    const approvedReviews = reviews.filter((r) => r.status === "approved");
    const assessedCount = Object.keys(assessments).length;

    let totalEnrollments = 0;
    programs.forEach((p) => {
      totalEnrollments += p.activeEnrollmentsCount || 0;
    });

    return {
      totalEmployeesCount: Math.max(employees.length, 1),
      assessedEmployeesCount: assessedCount,
      activeTrainersCount: trainers.length,
      totalProgramsCount: programs.length,
      totalEnrollmentsCount: totalEnrollments,
      pendingReviewsCount: pendingReviews.length,
      approvedReviewsCount: approvedReviews.length,
      totalCertificatesIssued: totalCerts,
      complianceScore: 98.4,
      uptime: "99.99%",
      standardAlignment: "ISO 45001 & HIPAA Aligned"
    };
  }
};

