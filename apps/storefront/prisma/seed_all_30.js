const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categoriesData = [
   { title: 'الملابس الرجالية', description: 'أحدث صيحات الأزياء والملابس الرجالية الراقية' },
   { title: 'الملابس النسائية', description: 'تشكيلة متنوعة وعصرية من الملابس النسائية' },
   { title: 'الأحذية', description: 'أحذية رياضية، كاجوال، ورسمية بجودة ممتازة' },
   { title: 'الساعات والإكسسوارات', description: 'ساعات فخمة وإكسسوارات تكمل أناقتك' },
   { title: 'الإلكترونيات الذكية', description: 'أجهزة ذكية وسماعات وإكسسوارات تقنية متطورة' },
   { title: 'الحقائب والمحافظ', description: 'حقائب سفر، حقائب كمبيوتر ومحافظ جلدية فاخرة' },
]

const brandsData = [
   { title: 'Nike', description: 'Just Do It - المنتجات الرياضية الأبرز عالمياً' },
   { title: 'Adidas', description: 'الأناقة والأداء الرياضي المتميز' },
   { title: 'Zara', description: 'أحدث خطوط الموضة والأزياء العصرية' },
   { title: 'Apple', description: 'الابتكار والتقنية الرائدة عالمياً' },
   { title: 'Samsung', description: 'أجهزة ذكية متطورة لحياتك اليومية' },
   { title: 'Sony', description: 'أعلى دقة صوتية وتقنيات سمعية' },
   { title: "Levi's", description: 'جينز أصلي وتصاميم كلاسيكية لا تتقادم' },
   { title: 'Fossil', description: 'ساعات وإكسسوارات جلدية ومعدنية راقية' },
   { title: 'Classic Touch', description: 'لمسات كلاسيكية من الجلد الطبيعي' },
   { title: 'Urban Line', description: 'أزياء شبابية وسترات عملية للمدينة' },
]

const productsData = [
   {
      title: 'تيشيرت قطني كلاسيكي مريح',
      brand: 'Zara',
      category: 'الملابس الرجالية',
      price: 25,
      discount: 5,
      stock: 40,
      description: 'تيشيرت مصنوع من القطن الطبيعي بنسبة 100%، ناعم على البشرة ومناسب للإطلالات اليومية المريحة.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      keywords: ['تيشيرت', 'قطن', 'ملابس رجالية', 'كاجوال'],
   },
   {
      title: 'قميص أكسفورد أبيض سليم فيت',
      brand: 'Zara',
      category: 'الملابس الرجالية',
      price: 45,
      discount: 0,
      stock: 25,
      description: 'قميص رجالي أبيض بأزرار كاملة وتصميم سليم فيت أنيق، مثالي للاجتماعات والعمل والمناسبات الرسمية.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      keywords: ['قميص', 'أبيض', 'رسمي', 'سليم فيت'],
   },
   {
      title: 'جاكيت جينز خريفي كلاسيكي',
      brand: "Levi's",
      category: 'الملابس الرجالية',
      price: 85,
      discount: 15,
      stock: 18,
      description: 'جاكيت جينز عالي الجودة بلون أزرق مغسول وتصميم كلاسيكي متين ومريح في الطقس المعتدل والبارد.',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      keywords: ['جاكيت', 'جينز', 'خريف', 'ليفايز'],
   },
   {
      title: 'بنطلون جينز أزرق كلاسيكي 501',
      brand: "Levi's",
      category: 'الملابس الرجالية',
      price: 65,
      discount: 10,
      stock: 30,
      description: 'بنطلون جينز كلاسيكي أصلي بقصة مستقيمة ومريحة، مصمم ليدوم طويلاً مع لمسة أصلية لا تفقد بريقها.',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      keywords: ['جينز', 'بنطلون', 'أزرق', 'ليفايز'],
   },
   {
      title: 'هودي رياضي ثقيل مع جيب أمامي',
      brand: 'Nike',
      category: 'الملابس الرجالية',
      price: 70,
      discount: 10,
      stock: 22,
      description: 'هودي شتوي رياضي دافئ مع بطانة ناعمة وغطاء للرأس، مثالي للتدريب في الصباح الباكر أو الأيام الباردة.',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
      keywords: ['هودي', 'نايكي', 'شتوي', 'رياضي'],
   },
   {
      title: 'جاكيت باركا شتوي مبطن ومقاوم للرياح',
      brand: 'Urban Line',
      category: 'الملابس الرجالية',
      price: 120,
      discount: 25,
      stock: 15,
      description: 'جاكيت شتوي فائق الدفء بتصميم عازل للحرارة وطارد للماء، يوفر أقصى درجات الحماية والأناقة الشتوية.',
      image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
      keywords: ['جاكيت', 'باركا', 'شتوي', 'مبطن'],
   },
   {
      title: 'فستان صيفي فلورال أنيق وعصري',
      brand: 'Zara',
      category: 'الملابس النسائية',
      price: 55,
      discount: 8,
      stock: 20,
      description: 'فستان صيفي ناعم بنقشات أزهار هادئة وقماش خفيف مريح، يمنحك إطلالة مشرقة وجذابة في النزهات الصيفية.',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      keywords: ['فستان', 'صيفي', 'أزهار', 'نسائي'],
   },
   {
      title: 'بنطلون كارغو عصري واسع بجيوب متعددة',
      brand: 'Urban Line',
      category: 'الملابس الرجالية',
      price: 50,
      discount: 0,
      stock: 25,
      description: 'بنطلون كارغو بلون زيتي عملي مزود بجيوب جانبية مريحة ومتينة للأنشطة الخارجية واليومية.',
      image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      keywords: ['كارغو', 'بنطلون', 'زيتي', 'كاجوال'],
   },
   {
      title: 'حذاء ركض فائق الخفة Air Max',
      brand: 'Nike',
      category: 'الأحذية',
      price: 130,
      discount: 20,
      stock: 18,
      description: 'حذاء جري مزود بتقنية الوسادة الهوائية لامتصاص الصدمات وتقديم راحة قصوى أثناء التمارين والمشي الطويل.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      keywords: ['حذاء', 'نايكي', 'اير ماكس', 'رياضي'],
   },
   {
      title: 'سنيكرز كاجوال كلاسيكي أبيض Stan Smith',
      brand: 'Adidas',
      category: 'الأحذية',
      price: 95,
      discount: 15,
      stock: 24,
      description: 'حذاء رياضي كلاسيكي باللون الأبيض وتفاصيل خضراء مميزة، يتناسب مع جميع أشكال الملابس اليومية والكاجوال.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      keywords: ['سنيكرز', 'اديداس', 'أبيض', 'كاجوال'],
   },
   {
      title: 'حذاء رسمي جلد أوكسفورد أسود فاخر',
      brand: 'Classic Touch',
      category: 'الأحذية',
      price: 110,
      discount: 0,
      stock: 16,
      description: 'حذاء رجالي رسمي مصنوع يدوياً من الجلد الطبيعي المصقول بلمعة أنيقة وتصميم أوكسفورد للمناسبات الرسمية.',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      keywords: ['حذاء رسمي', 'جلد طبيعي', 'أسود', 'أوكسفورد'],
   },
   {
      title: 'حذاء كاحل جلدي بني بتصميم تشيلسي',
      brand: 'Classic Touch',
      category: 'الأحذية',
      price: 125,
      discount: 20,
      stock: 14,
      description: 'حذاء بوت تشيلسي بني أنيق وسهل الارتداء بجوانب مرنة ونعل مطاطي قوي مقاوم للانزلاق.',
      image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      keywords: ['بوت', 'تشيلسي', 'جلد بني', 'أحذية'],
   },
   {
      title: 'حذاء تدريب ولياقة بدنية Ultraboost',
      brand: 'Adidas',
      category: 'الأحذية',
      price: 150,
      discount: 25,
      stock: 12,
      description: 'حذاء تدريب متطور بنعل Boost عالي الاستجابة يوفر استعادة الطاقة والراحة التامة للقدم طوال اليوم.',
      image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
      keywords: ['حذاء تدريب', 'اديداس', 'الترا بوست', 'جري'],
   },
   {
      title: 'ساعة يد ذكية Apple Watch Series 9',
      brand: 'Apple',
      category: 'الإلكترونيات الذكية',
      price: 399,
      discount: 40,
      stock: 10,
      description: 'أحدث ساعة ذكية من أبل مع شاشة Retina ساطعة دائماً ومستشعرات متقدمة لقياس نبضات القلب ونسبة الأكسجين.',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      keywords: ['ساعة ذكية', 'ابل', 'ابل واتش', 'الكترونيات'],
   },
   {
      title: 'سماعات رأس لاسلكية مانعة للضوضاء WH-1000XM5',
      brand: 'Sony',
      category: 'الإلكترونيات الذكية',
      price: 299,
      discount: 35,
      stock: 14,
      description: 'تجربة صوتية فائقة النقاء مع أفضل تقنية عزل ضوضاء في العالم وبطارية تدوم حتى 30 ساعة استخدام متواصل.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      keywords: ['سماعات', 'سوني', 'عزل ضوضاء', 'وايرلس'],
   },
   {
      title: 'سماعات أذن لاسلكية AirPods Pro الجيل الثاني',
      brand: 'Apple',
      category: 'الإلكترونيات الذكية',
      price: 219,
      discount: 20,
      stock: 20,
      description: 'صوت مكاني مخصص مع إلغاء نشط للضوضاء وميزة شفافية الصوت وعلبة شحن تدعم MagSafe وتحديد الموقع.',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      keywords: ['سماعات ايربودز', 'ابل', 'ايربودز برو', 'بلوتوث'],
   },
   {
      title: 'ساعة يد كلاسيكية بحزام جلدي بني فاخر',
      brand: 'Fossil',
      category: 'الساعات والإكسسوارات',
      price: 135,
      discount: 20,
      stock: 18,
      description: 'ساعة أنيقة بحركة كوارتز دقيقة ومينا فضي مميز مع حزام مصنوع من الجلد الطبيعي الفاخر بتطريز متقن.',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      keywords: ['ساعة كلاسيكية', 'فوسيل', 'جلد طبيعي', 'ساعات'],
   },
   {
      title: 'ساعة كرونوغراف ستانلس ستيل فضية',
      brand: 'Fossil',
      category: 'الساعات والإكسسوارات',
      price: 160,
      discount: 25,
      stock: 15,
      description: 'ساعة كرونوغراف متعددة الوظائف بهيكل فولاذي مقاوم للصدأ والماء حتى عمق 50 متراً مع مينا كحلي جذاب.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      keywords: ['ساعة ستيل', 'كرونوغراف', 'فوسيل', 'فضي'],
   },
   {
      title: 'سوار معصم رجالي معدني أنيق',
      brand: 'Fossil',
      category: 'الساعات والإكسسوارات',
      price: 35,
      discount: 5,
      stock: 35,
      description: 'إكسسوار رجالي راقي مصنوع من التيتانيوم والفولاذ المصقول مع قفل مغناطيسي آمن وعصري.',
      image: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=800&q=80',
      keywords: ['سوار', 'إكسسوار رجالي', 'فوسيل', 'معدن'],
   },
   {
      title: 'نظارة شمسية كلاسيكية مستقطبة بإطار أسود',
      brand: 'Urban Line',
      category: 'الساعات والإكسسوارات',
      price: 65,
      discount: 10,
      stock: 28,
      description: 'نظارات شمسية عصرية بعدسات مستقطبة تحمي بنسبة 100% من الأشعة فوق البنفسجية UV400 بإطار خفيف ومريح.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      keywords: ['نظارة شمسية', 'إكسسوارات', 'حماية UV', 'أسود'],
   },
   {
      title: 'محفظة رجالية جلد طبيعي بتقنية RFID',
      brand: 'Classic Touch',
      category: 'الحقائب والمحافظ',
      price: 32,
      discount: 5,
      stock: 45,
      description: 'محفظة رفيعة وأنيقة لحفظ البطاقات والنقود، مزودة بشريحة حماية RFID لمنع سرقة بيانات البطاقات الائتمانية.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      keywords: ['محفظة', 'جلد طبيعي', 'حماية بطاقات', 'اكسسوار'],
   },
   {
      title: 'حقيبة ظهر ذكية مقاومة للماء للكمبيوتر المحمول',
      brand: 'Urban Line',
      category: 'الحقائب والمحافظ',
      price: 58,
      discount: 10,
      stock: 20,
      description: 'حقيبة ظهر متعددة الجيوب مزودة بمخرج شحن USB وجيب مبطن للابتوب حتى مقاس 15.6 بوصة ومقاومة للماء.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      keywords: ['حقيبة ظهر', 'لابتوب', 'مقاوم للماء', 'شنطة'],
   },
   {
      title: 'حقيبة كتف نسائية جلدية راقية',
      brand: 'Zara',
      category: 'الحقائب والمحافظ',
      price: 75,
      discount: 12,
      stock: 18,
      description: 'حقيبة يد نسائية مصنوعة من الجلد الناعم بحزام كتف قابل للتعديل وسحاب معدني ذهبي لامع ومساحة داخلية واسعة.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      keywords: ['حقيبة نسائية', 'شنطة كتف', 'جلد', 'زارا'],
   },
   {
      title: 'حقيبة دفل رياضية للملابس والنادي',
      brand: 'Nike',
      category: 'الحقائب والمحافظ',
      price: 45,
      discount: 0,
      stock: 30,
      description: 'حقيبة رياضية مدمجة وقوية مزودة بجيب منفصل مخصص للأحذية وجيوب تهوية للملابس الرياضية.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      keywords: ['حقيبة رياضية', 'نايكي', 'دفل باج', 'نادي'],
   },
   {
      title: 'شاحن مغناطيسي لاسلكي سريع MagSafe',
      brand: 'Apple',
      category: 'الإلكترونيات الذكية',
      price: 49,
      discount: 5,
      stock: 25,
      description: 'قاعدة شحن لاسلكية سريعة تثبت مغناطيسياً بدقة على أجهزة الآيفون وسماعات أبل لتجربة شحن سلسة.',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      keywords: ['شاحن لاسلكي', 'ماج سيف', 'ابل', 'شاحن سريع'],
   },
   {
      title: 'بنك طاقة محمول 20000mAh شحن سريع PD',
      brand: 'Samsung',
      category: 'الإلكترونيات الذكية',
      price: 42,
      discount: 6,
      stock: 35,
      description: 'باور بانك سعة 20 ألف مللي أمبير بقدرة 25 واط، قادر على شحن هاتفك الذكي حتى 4 مرات بأمان وسرعة فائقة.',
      image: 'https://images.unsplash.com/photo-1609592426861-68b6b063d41f?auto=format&fit=crop&w=800&q=80',
      keywords: ['باور بانك', 'سامسونج', 'بطارية خارجية', 'شحن سريع'],
   },
   {
      title: 'بنطلون تدريب رياضي خفيف ومطاطي Tiro',
      brand: 'Adidas',
      category: 'الملابس الرجالية',
      price: 48,
      discount: 8,
      stock: 26,
      description: 'بنطلون تدريب كلاسيكي بخطوط أديداس الثلاثية الشهيرة وسحابات عند الكاحل لسهولة الارتداء والخلع.',
      image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
      keywords: ['بنطلون رياضي', 'اديداس', 'تيرو', 'تمارين'],
   },
   {
      title: 'جاكيت تدريب رياضي خفيف بسحاب كامل',
      brand: 'Nike',
      category: 'الملابس الرجالية',
      price: 75,
      discount: 10,
      stock: 20,
      description: 'سترة رياضية بأكمام طويلة وقماش Dri-FIT طارد للعرق يضمن الجفاف والانتعاش أثناء التمارين الحماسية.',
      image: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=800&q=80',
      keywords: ['جاكيت نايكي', 'دراي فيت', 'سترة رياضية', 'ملابس'],
   },
   {
      title: 'قبعة بيسبول كاب قطنية مطرزة بشعار',
      brand: 'Nike',
      category: 'الساعات والإكسسوارات',
      price: 24,
      discount: 0,
      stock: 50,
      description: 'كاب كاجوال مريح مع شريط قابل للتعديل وثقوب تهوية، يمنحك حماية مثالية من الشمس وإطلالة رياضية.',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      keywords: ['كاب', 'قبعة', 'نايكي', 'اكسسوارات'],
   },
   {
      title: 'حزام جلد طبيعي بإبزيم معدني فاخر',
      brand: 'Classic Touch',
      category: 'الساعات والإكسسوارات',
      price: 29,
      discount: 4,
      stock: 40,
      description: 'حزام رجالي كلاسيكي مصنوع من أجود أنواع الجلود الإيطالية بإبزيم معدني مقاوم للخدش، مناسب للبدل والجينز.',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
      keywords: ['حزام جلد', 'كلاسيك', 'إكسسوار رجالي', 'إبزيم'],
   },
]

const bannersData = [
   {
      label: 'تخفيضات الربيع الكبرى - خصم حتى 40%',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
   },
   {
      label: 'أحدث صيحات الموضة والإلكترونيات بين يديك',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80',
   },
   {
      label: 'إلكترونيات ذكية وساعات بأفضل الأسعار',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80',
   },
]

const blogsData = [
   {
      slug: 'how-to-choose-summer-outfits',
      title: 'دليلك الشامل لتنسيق الملابس العصرية لجميع المناسبات',
      description: 'نصائح وإرشادات لاختيار وتنسيق إطلالتك اليومية بأحدث الصيحات العالمية وأفضل خامات القطن والكتان.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      categories: ['أزياء', 'نصائح'],
      keywords: ['موضة', 'ملابس', 'تنسيق', 'أزياء'],
   },
   {
      slug: 'best-running-shoes-guide',
      title: 'أفضل 5 أحذية رياضية مريحة للتمارين اليومية والجري',
      description: 'مقارنة شاملة بين أشهر الأحذية الرياضية لاختيار الأنسب لراحتك وحماية مفاصلك أثناء التمرين والأنشطة.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      categories: ['رياضة', 'أحذية'],
      keywords: ['حذاء رياضي', 'جري', 'نايكي', 'اديداس'],
   },
   {
      slug: 'smartwatches-buyer-guide-2026',
      title: 'كيف تختار الساعة الذكية الأنسب لاحتياجاتك اليومية؟',
      description: 'أهم الميزات التي يجب الانتباه لها قبل شراء ساعتك الذكية القادمة من مستشعرات الصحة إلى عمر البطارية.',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      categories: ['تقنية', 'ساعات ذكية'],
      keywords: ['ساعة ذكية', 'ابل واتش', 'تكنولوجيا', 'صحة'],
   },
]

async function main() {
   console.log('--- بدء تهيئة البيانات (30 منتج، تصنيفات، براندات، بانرات، مقالات) ---')

   // 1. Create or update Categories
   const categoryMap = {}
   for (const cat of categoriesData) {
      const created = await prisma.category.upsert({
         where: { title: cat.title },
         update: { description: cat.description },
         create: { title: cat.title, description: cat.description },
      })
      categoryMap[cat.title] = created.id
      console.log(`تم تجهيز التصنيف: ${cat.title}`)
   }

   // 2. Create or update Brands
   const brandMap = {}
   for (const b of brandsData) {
      const created = await prisma.brand.upsert({
         where: { title: b.title },
         update: { description: b.description },
         create: { title: b.title, description: b.description },
      })
      brandMap[b.title] = created.id
      console.log(`تم تجهيز العلامة التجارية: ${b.title}`)
   }

   // 3. Delete old products to cleanly insert exactly 30 fresh products
   await prisma.productReview.deleteMany()
   await prisma.cartItem.deleteMany()
   await prisma.orderItem.deleteMany()
   await prisma.product.deleteMany()
   console.log('تم تنظيف المنتجات القديمة.')

   // 4. Create 30 products
   let count = 0
   for (const p of productsData) {
      count++
      const brandId = brandMap[p.brand] || Object.values(brandMap)[0]
      const categoryId = categoryMap[p.category] || Object.values(categoryMap)[0]

      await prisma.product.create({
         data: {
            title: p.title,
            description: p.description,
            price: p.price,
            discount: p.discount,
            stock: p.stock,
            isAvailable: true,
            isFeatured: count <= 8, // first 8 are featured
            images: [p.image],
            keywords: p.keywords,
            brand: { connect: { id: brandId } },
            categories: { connect: [{ id: categoryId }] },
         },
      })
      console.log(`[${count}/30] تم إنشاء المنتج: ${p.title} (${p.category})`)
   }

   // 5. Create Banners
   await prisma.banner.deleteMany()
   for (const ban of bannersData) {
      await prisma.banner.create({
         data: {
            label: ban.label,
            image: ban.image,
         },
      })
   }
   console.log('تم تجهيز 3 بانرات للرئيسية.')

   // 6. Create Author & Blogs
   const author = await prisma.author.upsert({
      where: { email: 'editorial@store.com' },
      update: {},
      create: {
         name: 'فريق التحرير',
         email: 'editorial@store.com',
         avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
   })

   await prisma.blog.deleteMany()
   for (const b of blogsData) {
      await prisma.blog.create({
         data: {
            slug: b.slug,
            title: b.title,
            description: b.description,
            image: b.image,
            categories: b.categories,
            keywords: b.keywords,
            authorId: author.id,
            content: `## ${b.title}\n\n${b.description}\n\nهذا المقال يوضح بالتفصيل أفضل الخيارات المتاحة في السوق وكيفية الاستفادة القصوى منها.`,
         },
      })
   }
   console.log('تم تجهيز 3 مقالات للمدونة.')

   const finalCount = await prisma.product.count()
   console.log(`\nنجحت العملية بالكامل! إجمالي المنتجات في قاعدة البيانات الآن: ${finalCount}`)
}

main()
   .catch((e) => {
      console.error('خطأ أثناء تشغيل السكريبت:', e)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
