import { Course, PdfDocument, Quiz, User } from '../types';

export const TEACHER_IMAGE = 'https://d.top4top.io/p_3880tveiv1.png';

export const ADMIN_CREDENTIALS = {
  phone: '01027568272',
  pass: '20271234'
};

export const ADMIN_USER: User = {
  id: 'admin_qaed_01',
  firstName: 'مستر أحمد',
  secondName: '',
  thirdName: '',
  lastName: 'عبدالحميد',
  phone: '01027568272',
  parentPhone: '01027568272',
  grade: 'second_general',
  isAzhar: false,
  governorate: 'قنا',
  gender: 'male',
  walletBalance: 99999,
  role: 'admin',
  centerId: 'ADMIN-MASTER-QAED',
  joinedDate: 'الإدارة العامة للمنصة',
  avatarUrl: TEACHER_IMAGE,
};

export const INITIAL_USER: User = {
  id: 'std_9021',
  firstName: 'محمود',
  secondName: 'حمدي',
  thirdName: 'أحمد',
  lastName: 'محمد',
  phone: '01559196263',
  parentPhone: '01144310307',
  grade: 'second_general',
  isAzhar: false,
  governorate: 'قنا',
  gender: 'male',
  walletBalance: 0,
  role: 'student',
  centerId: 'CTR-8842-QENA',
  joinedDate: 'الأحد 2 أغسطس 2026',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي (عام وبكالوريا)',
    subtitle: 'نشأة علم النفس وتطوره ومدارسه الكبرى + مدخل علم الاجتماع والبناء الاجتماعي',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (عام وبكالوريا)',
    subject: 'علم النفس والاجتماع 2ث',
    category: 'monthly',
    price: 150,
    originalPrice: 200,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    badgeText: 'شهر 9 ⚡',
    startDate: 'الأحد 2 سبتمبر 2026',
    lessonsCount: 8,
    totalHours: 14,
    description: 'كورس تأسيسي مكثف يشرح نشأة علم النفس ومراحله التاريخية ومدارسه الكبرى (البنائية، السلوكية، التحليل النفسي، الجشطالت، المعرفية)، مع تدريب على نواتج التعلم لعلم الاجتماع والبناء الاجتماعي وحل بنك أسئلة الوزارة ونماذج البكالوريا.',
    outcomes: [
      'فهم مراحل نشأة علم النفس (الفلسفية، الفسيولوجية، الاستقلال)',
      'التمييز بدقة بين مدارس علم النفس الكبرى وروادها (فونت، واطسون، فرويد، كوفكا)',
      'تطبيق مناهج البحث السيكولوجي (الاستبطان، التجريبي، شبه التجريبي، الإكلينيكي)',
      'استيعاب مفهوم البناء الاجتماعي ومكوناته والجماعات الاجتماعية الأولية والثانوية'
    ],
    isEnrolled: true,
    lessons: [
      {
        id: 'les-1',
        title: 'المحاضرة 1: نشأة علم النفس وتطوره والمدارس السيكولوجية الكبرى',
        description: 'شرح تمهيدي تفاعلي يربط المراحل التاريخية بنشأة علم النفس ومدرسة فونت والتحليل النفسي لفرويد',
        durationMinutes: 45,
        youtubeId: 'M7lc1UVf-VE',
        isFree: true,
        pdfUrl: '#',
        pdfTitle: 'مذكرة المحاضرة الأولى - نشأة علم النفس.pdf',
        hasQuiz: true,
        quizId: 'quiz-1',
        isCompleted: true
      },
      {
        id: 'les-2',
        title: 'المحاضرة 2: تعريف علم النفس وأهدافه ومجالاته الأساسية والتطبيقية',
        description: 'تحليل دقيق لأهداف علم النفس الثلاثة (الفهم والتفسير، التوقع والتنبؤ، الضبط والتحكم)',
        durationMinutes: 52,
        youtubeId: 'ysz5S6PUM-U',
        isFree: false,
        pdfUrl: '#',
        pdfTitle: 'خرائط ذهنية - مجالات علم النفس.pdf',
        hasQuiz: true,
        quizId: 'quiz-2',
        isCompleted: false
      },
      {
        id: 'les-3',
        title: 'المحاضرة 3: مناهج البحث في علم النفس (الاستبطان، المنهج التجريبي، الإكلينيكي)',
        description: 'الفروق الجوهرية بين المتغير المستقل والتابع والدخيل مع أمثلة وتطبيقات عملية',
        durationMinutes: 60,
        youtubeId: 'kJQP7kiw5Fk',
        isFree: false,
        pdfUrl: '#',
        pdfTitle: 'تدريبات البنك المعرفي على مناهج البحث.pdf',
        hasQuiz: true,
        quizId: 'quiz-1',
        isCompleted: false
      },
      {
        id: 'les-4',
        title: 'المحاضرة 4: مدخل علم الاجتماع والبناء الاجتماعي والجماعات الاجتماعية',
        description: 'تعريف علم الاجتماع ونشأته (ابن خلدون، أوجست كونت، إميل دوركايم) مع مفهوم البناء الاجتماعي',
        durationMinutes: 55,
        youtubeId: 'dQw4w9WgXcQ',
        isFree: false,
        pdfUrl: '#',
        pdfTitle: 'ملخص البناء الاجتماعي والجماعات.pdf',
        hasQuiz: true,
        quizId: 'quiz-2',
        isCompleted: false
      }
    ]
  },
  {
    id: 'course-2',
    title: 'باقة الترم الأول كامل - علم النفس والاجتماع 2 ثانوي (عام وبكالوريا)',
    subtitle: 'شرح شامل للعمليات المعرفية والدوافع والانفعالات والنظم والجماعات الاجتماعية مع بنك الأسئلة',
    grade: 'second_bac',
    gradeLabel: 'الصف الثاني الثانوي (بكالوريا وعام)',
    subject: 'علم النفس والاجتماع (بكالوريا)',
    category: 'package',
    price: 320,
    originalPrice: 420,
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    badgeText: 'الترم الأول كامل 🔥',
    startDate: 'الأحد 2 سبتمبر 2026',
    lessonsCount: 18,
    totalHours: 32,
    description: 'الباقة الشاملة لمنهج علم النفس والاجتماع للصف الثاني الثانوي بكالوريا وعام، تغطي العمليات المعرفية (الإحساس، الانتباه، الإدراك، الذاكرة)، والدوافع والانفعالات، والنظم الاجتماعية والتغير الاجتماعي مع ورش حل وامتحانات أسبوعية.',
    outcomes: [
      'إتقان العمليات المعرفية وتدرجها من الإحساس إلى الذاكرة والتفكير',
      'فهم ديناميات الدوافع والانفعالات وتأثيرها على السلوك البشري',
      'دراسة النظم الاجتماعية (الأسري، الاقتصادي، السياسي، التربوي)',
      'حل أكثر من 600 سؤال تابلت وبكالوريا بنظام نواتج التعلم'
    ],
    isEnrolled: false,
    lessons: [
      {
        id: 'les-201',
        title: 'المحاضرة 1: العمليات المعرفية - الإحساس وعتبات الإحساس (المطلقة والفارقة والقصوى)',
        description: 'كيف تستقبل الحواس المثيرات وتترجمها لإشارات عصبية؟ شرح وافٍ مع تجارب تفاعلية',
        durationMinutes: 50,
        youtubeId: 'M7lc1UVf-VE',
        isFree: true,
        pdfUrl: '#',
        pdfTitle: 'مذكرة الإحساس والانتباه.pdf',
        hasQuiz: true,
        quizId: 'quiz-1',
        isCompleted: false
      },
      {
        id: 'les-202',
        title: 'المحاضرة 2: الانتباه وأنواعه وعوامل تركيز الانتباه (الداخلية والخارجية)',
        description: 'التمييز بين الانتباه العفوي والإرادي واللاإرادي وعوامل تشتت الانتباه',
        durationMinutes: 55,
        youtubeId: 'ysz5S6PUM-U',
        isFree: false,
        pdfUrl: '#',
        pdfTitle: 'خرائط ذهنية - عوامل تركيز الانتباه.pdf',
        hasQuiz: true,
        quizId: 'quiz-2',
        isCompleted: false
      }
    ]
  },
  {
    id: 'course-3',
    title: 'كورس الشهر الأول - شهر 9 - أولى ثانوي (عام وبكالوريا)',
    subtitle: 'شرح تأسيسي مكثف وتطبيقات عملية مع بنك الأسئلة ونماذج التابلت',
    grade: 'first_general',
    gradeLabel: 'الصف الأول الثانوي (عام وبكالوريا)',
    subject: 'الصف الأول الثانوي',
    category: 'monthly',
    price: 140,
    originalPrice: 180,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    badgeText: 'شهر 9 🌟',
    startDate: 'الأحد 2 سبتمبر 2026',
    lessonsCount: 8,
    totalHours: 14,
    description: 'شرح مبسط وممتع لمنهج أولى ثانوي يؤسس عقليتك النقدية والتفكير المنطقي السليم مع أمثلة حية من المجتمع وتدريب مستمر على نماذج امتحانات التابلت.',
    outcomes: [
      'فهم معنى التفكير الإنساني وأساليبه المختلفة',
      'تجنب عوامل الوقوع في خطأ التفكير (الذاتية والموضوعية)',
      'اكتساب مهارات الحوار والتسامح الفكري والشك المنهجي',
      'الحصول على الدرجة النهائية في امتحانات نصف العام'
    ],
    isEnrolled: false,
    lessons: [
      {
        id: 'les-301',
        title: 'المحاضرة 1: التفكير الإنساني - مفهومه وأهميته وخصائصه',
        description: 'كيف يفكر العقل البشري؟ وما الذي يميز أساليب التفكير المختلفة؟',
        durationMinutes: 48,
        youtubeId: 'M7lc1UVf-VE',
        isFree: true,
        pdfUrl: '#',
        pdfTitle: 'المحاضرة الأولى أولى ثانوي.pdf',
        hasQuiz: true,
        quizId: 'quiz-3',
        isCompleted: false
      }
    ]
  },
  {
    id: 'course-4',
    title: 'باقة الترم الأول كامل - أولى ثانوي (عام وبكالوريا)',
    subtitle: 'المنهج كاملاً من الصفر حتى ليلة الامتحان مع المذكرات وبنك الأسئلة',
    grade: 'first_bac',
    gradeLabel: 'الصف الأول الثانوي (بكالوريا وعام)',
    subject: 'الصف الأول الثانوي (بكالوريا)',
    category: 'package',
    price: 260,
    originalPrice: 340,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    badgeText: 'الترم الأول كامل ⭐',
    startDate: 'الأحد 2 سبتمبر 2026',
    lessonsCount: 16,
    totalHours: 28,
    description: 'الباقة الذهبية للترم الأول كامل تشمل كافة موضوعات المنهج مع مراجعات منتصف ونهاية الفصل الدراسي، وورش حل مكثفة ومذكرات PDF شاملة.',
    outcomes: [
      'إتقان المنهج بالكامل وربط المفاهيم بالأحداث اليومية',
      'حل كافة اختبارات الأعوام السابقة ونماذج الوزارة',
      'خرائط ذهنية ملونة لكل درس تسهل المراجعة السريعة'
    ],
    isEnrolled: false,
    lessons: []
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'كويز المحاضرة الأولى: نشأة علم النفس وتطوره ومدارسه الكبرى - 2 ثانوي',
    courseId: 'course-1',
    lessonId: 'les-1',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (علم النفس والاجتماع)',
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: 'q1',
        question: 'مر علم النفس بمراحل تطورية أساسية؛ في أي مرحلة ارتبط علم النفس بدراسة "الماهية وطبيعة النفس والروح"؟',
        options: [
          'المرحلة الفلسفية اليونانية القديمة',
          'المرحلة الفسيولوجية البيولوجية (مرحلة فونت)',
          'مرحلة الاستقلال والانفصال التام',
          'المرحلة السلوكية المعاصرة'
        ],
        correctAnswerIndex: 0,
        explanation: 'في المرحلة الفلسفية القديمة، اعتبر الفلاسفة أن النفس أو الروح هي مصدر السلوك واستجابات الكائن الحي.',
        philosopherContext: 'سياق تاريخي: الفلسفة اليونانية وأفلاطون وأرسطو'
      },
      {
        id: 'q2',
        question: 'المدرسة التي أسسها العالم "وليم فونت" عام 1879 وأنشأ أول معمل لعلم النفس التجريبي في لايبزج بألمانيا هي:',
        options: [
          'المدرسة البنائية التي اتخذت من الخبرة الشعورية موضوعاً والاستبطان منهجاً',
          'المدرسة السلوكية التي ركزت على الملاحظة الخارجية للسلوك فقط',
          'مدرسة التحليل النفسي ورائدها سيجموند فرويد',
          'مدرسة الجشطالت والإدراك الكلي'
        ],
        correctAnswerIndex: 0,
        explanation: 'وليم فونت وتلميذه تيتشنر أسسا المدرسة البنائية التي حللت الوعي والخبرة الشعورية إلى عناصرها الأولية عبر منهج التأمل الباطني (الاستبطان).',
        philosopherContext: 'وليم فونت: مؤسس أول معمل لعلم النفس التجريبي 1879'
      },
      {
        id: 'q3',
        question: 'يرى "واطسون" مؤسس المدرسة السلوكية أن موضوع علم النفس الحقيقي هو:',
        options: [
          'السلوك الظاهري الملاحظ والقابل للقياس بدلاً من دراسة الشعور الباطني',
          'الدوافع اللاشعورية والغرائز المكبوتة منذ الطفولة',
          'الإدراك الكلي للظواهر حيث الكل أكبر من مجموع أجزائه',
          'العمليات المعرفية الوسيطة بين المثير والاستجابة'
        ],
        correctAnswerIndex: 0,
        explanation: 'السلوكية ترفض الاستبطان وتركز حصراً على دراسة السلوك الموضوعي القابل للملاحظة والقياس (مثير واستجابة).',
        philosopherContext: 'جون واطسون: ثورة السلوكية في علم النفس'
      },
      {
        id: 'q4',
        question: 'أكدت مدرسة "التحليل النفسي" بزعامة سيجموند فرويد على الأثر الحاسم لـ:',
        options: [
          'الدوافع اللاشعورية والغرائز المكبوتة وخبرات الطفولة المبكرة في تشكيل الشخصية',
          'العوامل البيئية الخارجية فقط دون أي أثر للغرائز',
          'الإدراك الحسي المباشر المنعزل',
          'التفكير الرياضي المنطقي الصوري المجرد'
        ],
        correctAnswerIndex: 0,
        explanation: 'فرويد أكد أن معظم سلوكياتنا تحركها دوافع لاشعورية ورواسب الطفولة المبكرة والمخاوف المكبوتة.',
        philosopherContext: 'سيجموند فرويد: نظرية التحليل النفسي واللاشعور'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'كويز علم الاجتماع: البناء الاجتماعي والجماعات الاجتماعية - 2 ثانوي',
    courseId: 'course-1',
    lessonId: 'les-4',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (علم الاجتماع)',
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: 'q2-1',
        question: 'يتميز "البناء الاجتماعي" بأنه نسيج مترابط من العلاقات والنظم؛ ومن أهم خصائصه أنه:',
        options: [
          'كل متكامل ومترابط الأجزاء ومتماسك لا يمكن فصل عناصره عن بعضها',
          'مجموعة أفراد معزولين لا تربطهم أي روابط أو نظم',
          'بناء مادي حسي يمكن رؤيته بالعين المجردة بشكل مباشر',
          'كيان جامد ثابت لا يطرأ عليه أي تطور أو تغير تاريخي'
        ],
        correctAnswerIndex: 0,
        explanation: 'البناء الاجتماعي هو كل متكامل ومتشابك، وأي تغير في أحد نظمه (كالاقتصاد مثلاً) يؤثر حتماً في بقية النظم كالعائلة والتعليم.',
        philosopherContext: 'علم الاجتماع الوظيفي والبناء الاجتماعي'
      },
      {
        id: 'q2-2',
        question: 'تختلف "الجماعة الأولية" عن "الجماعة الثانوية" في علم الاجتماع؛ وتعد الأسرة نموذجاً للجماعة الأولية لأنها تتميز بـ:',
        options: [
          'العلاقات الشخصية الوثيقة والمباشرة والروابط العاطفية القوية',
          'العلاقات الرسمية القائمة على المصالح المادية والعقود المؤقتة',
          'الحجم الكبير جداً وانعدام اللقاءات المباشرة بين الأعضاء',
          'التعامل غير المباشر عبر اللوائح الإدارية فقط'
        ],
        correctAnswerIndex: 0,
        explanation: 'الجماعة الأولية كالأسرة والأصدقاء تقوم على الاتصال المباشر والوجاهي والعواطف، بينما الجماعة الثانوية كالشركات والنوادي تقوم على المصلحة الرسمية.',
        philosopherContext: 'تشارلز كولي: تصنيف الجماعات الأولية والثانوية'
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'كويز أساليب التفكير وتطبيقاته - 1 ثانوي',
    courseId: 'course-3',
    lessonId: 'les-301',
    grade: 'first_general',
    gradeLabel: 'الصف الأول الثانوي',
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: 'q3-1',
        question: 'الأسلوب الذي يبحث عن العلل القريبة المباشرة للظواهر عبر التجربة والملاحظة الحسية هو:',
        options: [
          'الأسلوب العلمي',
          'الأسلوب الخرافي القائم على السذاجة والوهم',
          'الأسلوب الفلسفي القائم على العلل البعيدة الكلية',
          'الأسلوب الإبداعي القائم على الأصالة والتجديد'
        ],
        correctAnswerIndex: 0,
        explanation: 'الأسلوب العلمي يبحث دائماً عن الأسباب القريبة المباشرة والظواهر التجريبية المادية.',
        philosopherContext: 'أساليب التفكير البشري'
      },
      {
        id: 'q3-2',
        question: 'من العوامل الذاتية للوقوع في خطأ التفكير:',
        options: [
          'تغليب العاطفة والمشاعر على العقل',
          'عدم الدقة في استخدام اللغة',
          'صعوبة المشكلة عن مستوى القدرات',
          'الهيمنة والسلطة الفكرية الخارجية'
        ],
        correctAnswerIndex: 0,
        explanation: 'تغليب العاطفة هو عامل ذاتي داخلي يجعل الشخص يحكم وفق مشاعره وأهوائه بدلاً من المنطق العقلي السليم.',
        philosopherContext: 'عوامل الوقوع في خطأ التفكير الذاتية والموضوعية'
      }
    ]
  }
];

export const PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: 'pdf-1',
    title: 'مذكرة القائد في علم النفس والاجتماع - الترم الأول 2 ثانوي (الشاملة)',
    description: 'المذكرة الرسمية المعتمدة لمستر أحمد عبدالحميد شاملة نواتج التعلم والخرائط الذهنية وتلخيص أبواب علم النفس والاجتماع.',
    subject: 'علم النفس والاجتماع 2ث',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (علم النفس والاجتماع)',
    pagesCount: 78,
    pageCount: 78,
    fileSize: '14.2 MB',
    previewPages: [
      'مقدمة المنهج + الفهرس التفاعلي',
      'الباب الأول: نشأة علم النفس ومدارسه الكبرى ومناهج البحث',
      'الباب الثاني: العمليات المعرفية (الإحساس، الانتباه، الإدراك، الذاكرة)',
      'الباب الثالث: مدخل علم الاجتماع والبناء الاجتماعي والجماعات الاجتماعية'
    ]
  },
  {
    id: 'pdf-2',
    title: 'كتيب الخرائط الذهنية والتركات - علم النفس والاجتماع 2 ثانوي (بكالوريا وعام)',
    description: 'كتيب التركات والخرائط الذهنية لربط علماء النفس ورواد علم الاجتماع وحل أسئلة المستويات العليا.',
    subject: 'علم النفس والاجتماع',
    grade: 'second_bac',
    gradeLabel: 'الصف الثاني الثانوي (بكالوريا وعام)',
    pagesCount: 64,
    pageCount: 64,
    fileSize: '16.5 MB',
    previewPages: [
      'مصفوفة مقارنة مدارس علم النفس (فونت، واطسون، فرويد، كوفكا)',
      'خريطة العتبات الحسية وعوامل تركيز الانتباه',
      'مفتاح حل أسئلة المستويات العليا ونماذج التابلت والبكالوريا'
    ]
  },
  {
    id: 'pdf-3',
    title: 'مذكرة القائد التأسيسية - أولى ثانوي (عام وبكالوريا)',
    description: 'شرح مبسط وتدريبات شاملة على التفكير الإنساني وتجنب أخطاء التفكير ونماذج الامتحانات التفاعلية.',
    subject: 'الصف الأول الثانوي',
    grade: 'first_general',
    gradeLabel: 'الصف الأول الثانوي',
    pagesCount: 52,
    pageCount: 52,
    fileSize: '10.8 MB',
    previewPages: [
      'معنى التفكير الإنساني وخصائصه وأهميته',
      'أساليب التفكير وعوامل الوقوع في الخطأ',
      'نماذج امتحانات تفاعلية مطابقة لمواصفات الوزارة'
    ]
  }
];

export const SAMPLE_INVOICES = [
  {
    id: 'inv-101',
    orderNumber: 'ORD-98421',
    courseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    amount: 150,
    discount: 0,
    paymentMethod: 'فوري' as const,
    status: 'ناجحة' as const,
    date: 'الأحد 2 أغسطس 2026',
    itemsCount: 1,
    couponCode: 'QAED2026'
  }
];

export const MOCK_STUDENT_RECORDS: import('../types').StudentProgressRecord[] = [
  {
    id: 'rec-1',
    studentId: 'std_9021',
    studentName: 'محمود حمدي أحمد محمد',
    studentPhone: '01559196263',
    parentPhone: '01144310307',
    governorate: 'قنا',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (عام)',
    enrolledCourseId: 'course-1',
    enrolledCourseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    completedLessonsCount: 1,
    totalLessonsCount: 4,
    completedQuizzesCount: 1,
    totalQuizzesCount: 4,
    averageScore: 90,
    commitmentStatus: 'ممتاز',
    lastActivityDate: 'اليوم، 04:30 م',
    unlockedExceptionLessonIds: []
  },
  {
    id: 'rec-2',
    studentId: 'std_9022',
    studentName: 'أحمد ياسر عبدالكريم',
    studentPhone: '01019844215',
    parentPhone: '01123456789',
    governorate: 'قنا',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (عام)',
    enrolledCourseId: 'course-1',
    enrolledCourseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    completedLessonsCount: 2,
    totalLessonsCount: 4,
    completedQuizzesCount: 2,
    totalQuizzesCount: 4,
    averageScore: 95,
    commitmentStatus: 'ممتاز',
    lastActivityDate: 'أمس، 08:15 م',
    unlockedExceptionLessonIds: []
  },
  {
    id: 'rec-3',
    studentId: 'std_9023',
    studentName: 'مريم طارق الشاذلي',
    studentPhone: '01287654321',
    parentPhone: '01099887766',
    governorate: 'الأقصر',
    grade: 'second_bac',
    gradeLabel: 'الصف الثاني الثانوي (بكالوريا)',
    enrolledCourseId: 'course-2',
    enrolledCourseTitle: 'باقة الترم الأول كامل - علم النفس والاجتماع 2 ثانوي',
    completedLessonsCount: 1,
    totalLessonsCount: 4,
    completedQuizzesCount: 0,
    totalQuizzesCount: 4,
    averageScore: 0,
    commitmentStatus: 'مقصر بالواجبات',
    lastActivityDate: 'منذ يومين',
    unlockedExceptionLessonIds: []
  },
  {
    id: 'rec-4',
    studentId: 'std_9024',
    studentName: 'كريم مصطفى الهواري',
    studentPhone: '01155443322',
    parentPhone: '01033221100',
    governorate: 'سوهاج',
    grade: 'first_general',
    gradeLabel: 'الصف الأول الثانوي (عام)',
    enrolledCourseId: 'course-3',
    enrolledCourseTitle: 'كورس الشهر الأول - شهر 9 - أولى ثانوي',
    completedLessonsCount: 1,
    totalLessonsCount: 1,
    completedQuizzesCount: 1,
    totalQuizzesCount: 1,
    averageScore: 85,
    commitmentStatus: 'جيد جداً',
    lastActivityDate: 'اليوم، 12:00 م',
    unlockedExceptionLessonIds: []
  },
  {
    id: 'rec-5',
    studentId: 'std_9025',
    studentName: 'سارة خالد الدندراوي',
    studentPhone: '01511223344',
    parentPhone: '01244556677',
    governorate: 'قنا',
    grade: 'second_general',
    gradeLabel: 'الصف الثاني الثانوي (عام)',
    enrolledCourseId: 'course-1',
    enrolledCourseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    completedLessonsCount: 0,
    totalLessonsCount: 4,
    completedQuizzesCount: 0,
    totalQuizzesCount: 4,
    averageScore: 0,
    commitmentStatus: 'يحتاج متابعة',
    lastActivityDate: 'منذ 3 أيام',
    unlockedExceptionLessonIds: []
  }
];

export const MOCK_HOMEWORK_SUBMISSIONS: import('../types').HomeworkSubmission[] = [
  {
    id: 'hw-1',
    quizId: 'quiz-1',
    quizTitle: 'كويز المحاضرة الأولى: نشأة علم النفس ومدارسه الكبرى',
    lessonId: 'les-1',
    lessonTitle: 'المحاضرة 1: نشأة علم النفس وتطوره والمدارس السيكولوجية الكبرى',
    courseId: 'course-1',
    courseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    studentId: 'std_9021',
    studentName: 'محمود حمدي أحمد محمد',
    studentPhone: '01559196263',
    parentPhone: '01144310307',
    isSubmitted: true,
    score: 18,
    totalMarks: 20,
    percentage: 90,
    status: 'passed',
    submittedAt: 'الأحد 2 أغسطس 2026 - 05:40 م',
    attemptsCount: 1
  },
  {
    id: 'hw-2',
    quizId: 'quiz-1',
    quizTitle: 'كويز المحاضرة الأولى: نشأة علم النفس ومدارسه الكبرى',
    lessonId: 'les-1',
    lessonTitle: 'المحاضرة 1: نشأة علم النفس وتطوره والمدارس السيكولوجية الكبرى',
    courseId: 'course-1',
    courseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    studentId: 'std_9022',
    studentName: 'أحمد ياسر عبدالكريم',
    studentPhone: '01019844215',
    parentPhone: '01123456789',
    isSubmitted: true,
    score: 20,
    totalMarks: 20,
    percentage: 100,
    status: 'passed',
    submittedAt: 'الأحد 2 أغسطس 2026 - 07:15 م',
    attemptsCount: 1
  },
  {
    id: 'hw-3',
    quizId: 'quiz-2',
    quizTitle: 'كويز المحاضرة الثانية: تعريف علم النفس وأهدافه ومجالاته',
    lessonId: 'les-2',
    lessonTitle: 'المحاضرة 2: تعريف علم النفس وأهدافه ومجالاته الأساسية والتطبيقية',
    courseId: 'course-1',
    courseTitle: 'كورس الشهر الأول - شهر 9 - علم النفس والاجتماع 2 ثانوي',
    studentId: 'std_9022',
    studentName: 'أحمد ياسر عبدالكريم',
    studentPhone: '01019844215',
    parentPhone: '01123456789',
    isSubmitted: true,
    score: 19,
    totalMarks: 20,
    percentage: 95,
    status: 'passed',
    submittedAt: 'الإثنين 3 أغسطس 2026 - 09:30 م',
    attemptsCount: 1
  },
  {
    id: 'hw-4',
    quizId: 'quiz-1',
    quizTitle: 'كويز المحاضرة الأولى: نشأة علم النفس ومدارسه الكبرى',
    lessonId: 'les-1',
    lessonTitle: 'المحاضرة 1: العمليات المعرفية - الإحساس وعتبات الإحساس',
    courseId: 'course-2',
    courseTitle: 'باقة الترم الأول كامل - علم النفس والاجتماع 2 ثانوي',
    studentId: 'std_9023',
    studentName: 'مريم طارق الشاذلي',
    studentPhone: '01287654321',
    parentPhone: '01099887766',
    isSubmitted: false,
    score: 0,
    totalMarks: 20,
    percentage: 0,
    status: 'pending',
    submittedAt: 'لم يتم التسليم بعد (تأخر 48 ساعة)',
    attemptsCount: 0
  },
  {
    id: 'hw-5',
    quizId: 'quiz-3',
    quizTitle: 'كويز المحاضرة الأولى: التفكير الإنساني وأساليبه - 1 ثانوي',
    lessonId: 'les-301',
    lessonTitle: 'المحاضرة 1: التفكير الإنساني - مفهومه وأهميته وخصائصه',
    courseId: 'course-3',
    courseTitle: 'كورس الشهر الأول - شهر 9 - أولى ثانوي',
    studentId: 'std_9024',
    studentName: 'كريم مصطفى الهواري',
    studentPhone: '01155443322',
    parentPhone: '01033221100',
    isSubmitted: true,
    score: 17,
    totalMarks: 20,
    percentage: 85,
    status: 'passed',
    submittedAt: 'الثلاثاء 4 أغسطس 2026 - 02:10 م',
    attemptsCount: 1
  }
];
