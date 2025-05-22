// Define all translations for the app

export type Language = 'kk' | 'ru' | 'en';

export type TranslationKeys = {
  // General
  appName: string;
  loading: string;
  error: string;
  success: string;
  info: string;
  loadingOrderData: string;
  orderNotFound: string;
  liveTracking: string;
  delivery: string;
  estimatedArrival: string;
  waitingForDriver: string;
  deliveryCompleted: string;
  viewFullMap: string;
  refreshMap: string;
  guest: string;
  
  // Analytics
  revenue: string;
  analyticsOrders: string;
  onTimeDelivery: string;
  cancelRate: string;
  monthlyTrends: string;
  
  // Order Details
  orderDetails: string;
  date: string;
  total: string;
  status: string;
  orderId: string;
  locations: string;
  actions: string;
  markAsCompleted: string;
  
  // Theme Settings
  appearance: string;
  themeMode: string;
  themeColor: string;
  
  // Auth Screens
  login: string;
  register: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  enterEmail: string;
  enterUsername: string;
  enterPassword: string;
  enterFullName: string;
  confirmYourPassword: string;
  signIn: string;
  signUp: string;
  welcomeBack: string;
  createAccount: string;
  getStarted: string;
  loginFailed: string;
  pleaseEnterCredentials: string;

  // Tab Navigation
  home: string;
  analysis: string;
  orders: string;
  profile: string;
  
  // Home Tab
  dashboard: string;
  orderCompletionRate: string;
  profitOverview: string;
  totalOrders: string;
  completed: string;
  pending: string;
  week: string;
  month: string;
  recentOrders: string;
  viewAll: string;
  noRecentOrders: string;
  
  // Analysis Tab
  logisticsAnalytics: string;
  orderStatistics: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  averageOrderValue: string;
  topVehicleTypes: string;
  topProducts: string;
  orderTrends: string;
  
  // Orders Tab
  newOrders: string;
  myOrders: string;
  all: string;
  inProgress: string;
  cancelled: string;
  customer: string;
  origin: string;
  destination: string;
  vehicle: string;
  product: string;
  weight: string;
  price: string;
  driver: string;
  eta: string;
  deliveredOn: string;
  reason: string;
  trackOrder: string;
  acceptOrder: string;
  viewDetails: string;
  reject: string;
  noOrdersFound: string;
  noNewOrders: string;
  
  // Filter Options
  showFilters: string;
  hideFilters: string;
  vehicleType: string;
  productType: string;
  priceRange: string;
  
  // Profile Page
  personalInfo: string;
  phone: string;
  company: string;
  language: string;
  selectLanguage: string;
  settings: string;
  notifications: string;
  security: string;
  help: string;
  logout: string;

  // Button Actions
  continue: string;
  cancel: string;
  save: string;
  accept: string;
  
  // Driver-specific
  driverDashboard: string;
  activeOrders: string;
  rating: string;
  quickAccess: string;
  myDocuments: string;
  myProfile: string;
  myTruck: string;
  experience: string;
  years: string;
  totalDistance: string;
  assignedTruck: string;
  availableOrders: string;
  documents: string;
  
  // Document Management
  driversLicense: string;
  idCard: string;
  vehicleRegistration: string;
  insurance: string;
  uploadAndManageDocuments: string;
  verified: string;
  rejected: string;
  pendingReview: string;
  updateDocument: string;
  uploadDocument: string;
  viewDocument: string;
  documentViewerWouldOpenHere: string;
  note: string;
  documentsMustBeClearAndValid: string;
  verificationMayTakeTime: string;
  failedToLoadDocuments: string;
  failedToUploadDocument: string;
  documentUploadedSuccessfully: string;
  pdfPreviewNotAvailable: string;
  openInExternalApp: string;
};

export const translations: Record<Language, TranslationKeys> = {
  // EN translations
  en: {
    // General
    appName: 'Logistics',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    info: 'Information',
    loadingOrderData: 'Loading order data...',
    orderNotFound: 'Order not found',
    liveTracking: 'Live Tracking',
    delivery: 'Delivery Truck',
    estimatedArrival: 'Estimated arrival time',
    waitingForDriver: 'Waiting for driver',
    deliveryCompleted: 'Delivery completed',
    viewFullMap: 'View full map',
    refreshMap: 'Reset map view',
    guest: 'Guest',
    
    // Analytics
    revenue: 'Revenue',
    analyticsOrders: 'Orders',
    onTimeDelivery: 'On-time Delivery',
    cancelRate: 'Cancel Rate',
    monthlyTrends: 'Monthly Trends',

    
    
    // Order Details
    orderDetails: 'Order Details',
    date: 'Date',
    total: 'Total',
    status: 'Status',
    orderId: 'Order ID',
    locations: 'Locations',
    actions: 'Actions',
    markAsCompleted: 'Mark as Completed',
    
    // Theme Settings
    appearance: 'Appearance',
    themeMode: 'Theme Mode',
    themeColor: 'Theme Color',
    
    // Auth Screens
    login: 'Login',
    register: 'Register',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    enterEmail: 'Enter your email',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    enterFullName: 'Enter your full name',
    confirmYourPassword: 'Confirm your password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    welcomeBack: 'Welcome back!',
    createAccount: 'Create an Account',
    getStarted: 'Get Started',
    loginFailed: 'Login failed, please check your credentials',
    pleaseEnterCredentials: 'Please enter your username and password',
    
    // Tab Navigation
    home: 'Home',
    analysis: 'Analysis',
    orders: 'Orders',
    profile: 'Profile',
    
    // Home Tab
    dashboard: 'Dashboard',
    orderCompletionRate: 'Order Completion Rate',
    profitOverview: 'Profit Overview',
    totalOrders: 'Total Orders',
    completed: 'Completed',
    pending: 'Pending',
    week: 'Week',
    month: 'Month',
    recentOrders: 'Recent Orders',
    viewAll: 'View All',
    noRecentOrders: 'No recent orders to display',
    
    // Analysis Tab
    logisticsAnalytics: 'Logistics Analytics',
    orderStatistics: 'Order Statistics',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    averageOrderValue: 'Average Order Value',
    topVehicleTypes: 'Top Vehicle Types',
    topProducts: 'Top Products',
    orderTrends: 'Order Trends',
    
    // Orders Tab
    newOrders: 'New Orders',
    myOrders: 'My Orders',
    all: 'All',
    inProgress: 'In Progress',
    cancelled: 'Cancelled',
    customer: 'Customer',
    origin: 'Origin',
    destination: 'Destination',
    vehicle: 'Vehicle',
    product: 'Product',
    weight: 'Weight',
    price: 'Price',
    driver: 'Driver',
    eta: 'ETA',
    deliveredOn: 'Delivered On',
    reason: 'Reason',
    trackOrder: 'Track Order',
    acceptOrder: 'Accept Order',
    viewDetails: 'View Details',
    reject: 'Reject',
    noOrdersFound: 'No orders found',
    noNewOrders: 'No new orders',
    
    // Filter Options
    showFilters: 'Show Filters',
    hideFilters: 'Hide Filters',
    vehicleType: 'Vehicle Type',
    productType: 'Product Type',
    priceRange: 'Price Range',
    
    // Profile Page
    personalInfo: 'Personal Info',
    phone: 'Phone',
    company: 'Company',
    language: 'Language',
    selectLanguage: 'Select Language',
    settings: 'Settings',
    notifications: 'Notifications',
    security: 'Security',
    help: 'Help',
    logout: 'Logout',
    
    // Button Actions
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    accept: 'Accept',
    
    // Driver-specific
    driverDashboard: 'Driver Dashboard',
    activeOrders: 'Active Orders',
    rating: 'Rating',
    quickAccess: 'Quick Access',
    myDocuments: 'My Documents',
    myProfile: 'My Profile',
    myTruck: 'My Truck',
    experience: 'Experience',
    years: 'years',
    totalDistance: 'Total Distance',
    assignedTruck: 'Assigned Truck',
    availableOrders: 'Available Orders',
    documents: 'Documents',
    
    // Document Management
    driversLicense: 'Driver\'s License',
    idCard: 'ID Card',
    vehicleRegistration: 'Vehicle Registration',
    insurance: 'Insurance',
    uploadAndManageDocuments: 'Upload and Manage Documents',
    verified: 'Verified',
    rejected: 'Rejected',
    pendingReview: 'Pending Review',
    updateDocument: 'Update Document',
    uploadDocument: 'Upload Document',
    viewDocument: 'View Document',
    documentViewerWouldOpenHere: 'Document viewer would open here',
    note: 'Note',
    documentsMustBeClearAndValid: 'Documents must be clear and valid',
    verificationMayTakeTime: 'Verification may take 24-48 hours',
    failedToLoadDocuments: 'Failed to load documents',
    failedToUploadDocument: 'Failed to upload document',
    documentUploadedSuccessfully: 'Document uploaded successfully',
    pdfPreviewNotAvailable: 'PDF preview is not available in the app',
    openInExternalApp: 'Open in external app'
  },
  
  // Russian translations
  ru: {
    // General
    appName: 'Логистика',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    info: 'Информация',
    loadingOrderData: 'Загрузка данных заказа...',
    orderNotFound: 'Заказ не найден',
    liveTracking: 'Отслеживание',
    delivery: 'Грузовик доставки',
    estimatedArrival: 'Ожидаемое время прибытия',
    waitingForDriver: 'Ожидание водителя',
    deliveryCompleted: 'Доставка завершена',
    viewFullMap: 'Посмотреть полную карту',
    refreshMap: 'Сбросить вид карты',
    guest: 'Гость',
    
    // Analytics
    revenue: 'Доход',
    analyticsOrders: 'Заказы',
    onTimeDelivery: 'Своевременная доставка',
    cancelRate: 'Частота отмены',
    monthlyTrends: 'Ежемесячные тренды',

    
    // Order Details
    orderDetails: 'Детали заказа',
    date: 'Дата',
    total: 'Сумма',
    status: 'Статус',
    orderId: 'Номер заказа',
    locations: 'Локации',
    actions: 'Действия',
    markAsCompleted: 'Отметить как выполненный',
    
    // Theme Settings
    appearance: 'Внешний вид',
    themeMode: 'Режим темы',
    themeColor: 'Цвет темы',
    
    // Auth Screens
    login: 'Вход',
    register: 'Регистрация',
    email: 'Электронная почта',
    username: 'Имя пользователя',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    fullName: 'Полное имя',
    forgotPassword: 'Забыли пароль?',
    dontHaveAccount: 'Нет аккаунта?',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    enterEmail: 'Введите вашу электронную почту',
    enterUsername: 'Введите ваше имя пользователя',
    enterPassword: 'Введите ваш пароль',
    enterFullName: 'Введите ваше полное имя',
    confirmYourPassword: 'Подтвердите ваш пароль',
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    welcomeBack: 'С возвращением!',
    createAccount: 'Создать аккаунт',
    getStarted: 'Начать',
    loginFailed: 'Ошибка входа, проверьте ваши данные',
    pleaseEnterCredentials: 'Пожалуйста, введите имя пользователя и пароль',
    
    // Tab Navigation
    home: 'Главная',
    analysis: 'Аналитика',
    orders: 'Заказы',
    profile: 'Профиль',
    
    // Home Tab
    dashboard: 'Панель управления',
    orderCompletionRate: 'Процент выполнения заказов',
    profitOverview: 'Обзор прибыли',
    totalOrders: 'Всего заказов',
    completed: 'Выполнено',
    pending: 'В ожидании',
    week: 'Неделя',
    month: 'Месяц',
    recentOrders: 'Недавние заказы',
    viewAll: 'Смотреть все',
    noRecentOrders: 'Нет недавних заказов для отображения',
    
    // Analysis Tab
    logisticsAnalytics: 'Аналитика логистики',
    orderStatistics: 'Статистика заказов',
    today: 'Сегодня',
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    averageOrderValue: 'Средняя стоимость заказа',
    topVehicleTypes: 'Популярные типы транспорта',
    topProducts: 'Популярные продукты',
    orderTrends: 'Тенденции заказов',
    
    // Orders Tab
    newOrders: 'Новые заказы',
    myOrders: 'Мои заказы',
    all: 'Все',
    inProgress: 'В процессе',
    cancelled: 'Отменено',
    customer: 'Клиент',
    origin: 'Откуда',
    destination: 'Куда',
    vehicle: 'Транспорт',
    product: 'Продукт',
    weight: 'Вес',
    price: 'Цена',
    driver: 'Водитель',
    eta: 'Ожидаемое время прибытия',
    deliveredOn: 'Доставлено',
    reason: 'Причина',
    trackOrder: 'Отследить заказ',
    acceptOrder: 'Принять заказ',
    viewDetails: 'Просмотреть детали',
    reject: 'Отклонить',
    noOrdersFound: 'Заказы не найдены',
    noNewOrders: 'Нет новых заказов',
    
    // Filter Options
    showFilters: 'Показать фильтры',
    hideFilters: 'Скрыть фильтры',
    vehicleType: 'Тип транспорта',
    productType: 'Тип продукта',
    priceRange: 'Диапазон цен',
    
    // Profile Page
    personalInfo: 'Личная информация',
    phone: 'Телефон',
    company: 'Компания',
    language: 'Язык',
    selectLanguage: 'Выбрать язык',
    settings: 'Настройки',
    notifications: 'Уведомления',
    security: 'Безопасность',
    help: 'Помощь',
    logout: 'Выйти',
    
    // Button Actions
    continue: 'Продолжить',
    cancel: 'Отмена',
    save: 'Сохранить',
    accept: 'Принять',
    
    // Driver-specific
    driverDashboard: 'Панель водителя',
    activeOrders: 'Активные заказы',
    rating: 'Рейтинг',
    quickAccess: 'Быстрый доступ',
    myDocuments: 'Мои документы',
    myProfile: 'Мой профиль',
    myTruck: 'Мой грузовик',
    experience: 'Опыт',
    years: 'лет',
    totalDistance: 'Общее расстояние',
    assignedTruck: 'Назначенный грузовик',
    availableOrders: 'Доступные заказы',
    documents: 'Документы',
    
    // Document Management
    driversLicense: 'Водительское удостоверение',
    idCard: 'Удостоверение личности',
    vehicleRegistration: 'Регистрация ТС',
    insurance: 'Страховка',
    uploadAndManageDocuments: 'Загрузка и управление документами',
    verified: 'Проверено',
    rejected: 'Отклонено',
    pendingReview: 'На рассмотрении',
    updateDocument: 'Обновить документ',
    uploadDocument: 'Загрузить документ',
    viewDocument: 'Просмотреть документ',
    documentViewerWouldOpenHere: 'Здесь откроется просмотр документов',
    note: 'Примечание',
    documentsMustBeClearAndValid: 'Документы должны быть четкими и действительными',
    verificationMayTakeTime: 'Проверка может занять 24-48 часов',
    failedToLoadDocuments: 'Не удалось загрузить документы',
    failedToUploadDocument: 'Не удалось загрузить документ',
    documentUploadedSuccessfully: 'Документ успешно загружен',
    pdfPreviewNotAvailable: 'Предпросмотр PDF недоступен в приложении',
    openInExternalApp: 'Открыть во внешнем приложении'
  },
  
  // Kazakh translations
  kk: {
    // General
    appName: 'Algalyq',
    loading: 'Жүктелуде...',
    error: 'Қате',
    success: 'Сәтті',
    info: 'Ақпарат',
    loadingOrderData: 'Тапсырыс деректері жүктелуде...',
    orderNotFound: 'Тапсырыс табылмады',
    liveTracking: 'Тірі бақылау',
    delivery: 'Жеткізу көлігі',
    estimatedArrival: 'Болжамды келу уақыты',
    waitingForDriver: 'Жүргізушіні күту',
    deliveryCompleted: 'Жеткізу аяқталды',
    viewFullMap: 'Толық картаны көру',
    refreshMap: 'Карта көрінісін бастапқы қалпына келтіру',
    guest: 'Қонақ',
    
    // Analytics
    revenue: 'Түсім',
    analyticsOrders: 'Тапсырыстар',
    onTimeDelivery: 'Уақтылы жеткізу',
    cancelRate: 'Бас тарту жиілігі',
    monthlyTrends: 'Айлық трендтер',
    
    // Order Details
    orderDetails: 'Тапсырыс мәліметтері',
    date: 'Күні',
    total: 'Сомасы',
    status: 'Күйі',
    orderId: 'Тапсырыс нөмірі',
    locations: 'Орналасқан жерлер',
    actions: 'Әрекеттер',
    markAsCompleted: 'Аяқталды деп белгілеу',
    
    // Theme Settings
    appearance: 'Сыртқы көрініс',
    themeMode: 'Тақырып режимі',
    themeColor: 'Тақырып түсі',
    
    // Auth Screens
    login: 'Кіру',
    register: 'Тіркелу',
    email: 'Электрондық пошта',
    username: 'Пайдаланушы аты',
    password: 'Құпия сөз',
    confirmPassword: 'Құпия сөзді растаңыз',
    fullName: 'Толық аты',
    forgotPassword: 'Құпия сөзді ұмыттыңыз ба?',
    dontHaveAccount: 'Тіркелгіңіз жоқ па?',
    alreadyHaveAccount: 'Тіркелгіңіз бар ма?',
    enterEmail: 'Электрондық поштаңызды енгізіңіз',
    enterUsername: 'Пайдаланушы атыңызды енгізіңіз',
    enterPassword: 'Құпия сөзіңізді енгізіңіз',
    enterFullName: 'Толық атыңызды енгізіңіз',
    confirmYourPassword: 'Құпия сөзіңізді растаңыз',
    signIn: 'Кіру',
    signUp: 'Тіркелу',
    welcomeBack: 'Қайта келгеніңізге қош келдіңіз!',
    createAccount: 'Тіркелгі жасау',
    getStarted: 'Бастау',
    loginFailed: 'Кіру сәтсіз аяқталды, деректеріңізді тексеріңіз',
    pleaseEnterCredentials: 'Пайдаланушы атыңыз бен құпия сөзіңізді енгізіңіз',
    
    // Tab Navigation
    home: 'Басты бет',
    analysis: 'Талдау',
    orders: 'Тапсырыстар',
    profile: 'Профиль',
    
    // Home Tab
    dashboard: 'Басқару тақтасы',
    orderCompletionRate: 'Тапсырыс аяқталу көрсеткіші',
    profitOverview: 'Пайда шолуы',
    totalOrders: 'Барлық тапсырыстар',
    completed: 'Аяқталған',
    pending: 'Күтілуде',
    week: 'Апта',
    month: 'Ай',
    recentOrders: 'Соңғы тапсырыстар',
    viewAll: 'Барлығын көру',
    noRecentOrders: 'Көрсетілетін соңғы тапсырыстар жоқ',
    
    // Analysis Tab
    logisticsAnalytics: 'Логистика аналитикасы',
    orderStatistics: 'Тапсырыс статистикасы',
    today: 'Бүгін',
    thisWeek: 'Осы апта',
    thisMonth: 'Осы ай',
    averageOrderValue: 'Орташа тапсырыс құны',
    topVehicleTypes: 'Танымал көлік түрлері',
    topProducts: 'Танымал өнімдер',
    orderTrends: 'Тапсырыс тенденциялары',
    
    // Orders Tab
    newOrders: 'Жаңа тапсырыстар',
    myOrders: 'Менің тапсырыстарым',
    all: 'Барлығы',
    inProgress: 'Орындалуда',
    cancelled: 'Бас тартылған',
    customer: 'Тұтынушы',
    origin: 'Қайдан',
    destination: 'Қайда',
    vehicle: 'Көлік',
    product: 'Өнім',
    weight: 'Салмақ',
    price: 'Баға',
    driver: 'Жүргізуші',
    eta: 'Күтілетін келу уақыты',
    deliveredOn: 'Жеткізілген күні',
    reason: 'Себеп',
    trackOrder: 'Тапсырысты бақылау',
    acceptOrder: 'Тапсырысты қабылдау',
    viewDetails: 'Мәліметтерді көру',
    reject: 'Бас тарту',
    noOrdersFound: 'Тапсырыстар табылмады',
    noNewOrders: 'Жаңа тапсырыстар жоқ',
    
    // Filter Options
    showFilters: 'Сүзгілерді көрсету',
    hideFilters: 'Сүзгілерді жасыру',
    vehicleType: 'Көлік түрі',
    productType: 'Өнім түрі',
    priceRange: 'Баға ауқымы',
    
    // Profile Page
    personalInfo: 'Жеке ақпарат',
    phone: 'Телефон',
    company: 'Компания',
    language: 'Тіл',
    selectLanguage: 'Тілді таңдау',
    settings: 'Параметрлер',
    notifications: 'Хабарландырулар',
    security: 'Қауіпсіздік',
    help: 'Көмек',
    logout: 'Шығу',
    
    // Button Actions
    continue: 'Жалғастыру',
    cancel: 'Бас тарту',
    save: 'Сақтау',
    accept: 'Қабылдау',
    
    // Driver-specific
    driverDashboard: 'Жүргізуші тақтасы',
    activeOrders: 'Белсенді тапсырыстар',
    rating: 'Рейтинг',
    quickAccess: 'Жылдам кіру',
    myDocuments: 'Менің құжаттарым',
    myProfile: 'Менің профилім',
    myTruck: 'Менің көлігім',
    experience: 'Тәжірибе',
    years: 'жыл',
    totalDistance: 'Жалпы қашықтық',
    assignedTruck: 'Тағайындалған көлік',
    availableOrders: 'Қолжетімді тапсырыстар',
    documents: 'Құжаттар',
    
    // Document Management
    driversLicense: 'Жүргізуші куәлігі',
    idCard: 'Жеке куәлік',
    vehicleRegistration: 'Көлік тіркеуі',
    insurance: 'Сақтандыру',
    uploadAndManageDocuments: 'Құжаттарды жүктеу және басқару',
    verified: 'Тексерілген',
    rejected: 'Қабылданбады',
    pendingReview: 'Қарастырылуда',
    updateDocument: 'Құжатты жаңарту',
    uploadDocument: 'Құжатты жүктеу',
    viewDocument: 'Құжатты қарау',
    documentViewerWouldOpenHere: 'Құжат қарау құралы осында ашылады',
    note: 'Ескертпе',
    documentsMustBeClearAndValid: 'Құжаттар анық және жарамды болуы керек',
    verificationMayTakeTime: 'Тексеру 24-48 сағат алуы мүмкін',
    failedToLoadDocuments: 'Құжаттарды жүктеу сәтсіз аяқталды',
    failedToUploadDocument: 'Құжатты жүктеу сәтсіз аяқталды',
    documentUploadedSuccessfully: 'Құжат сәтті жүктелді',
    pdfPreviewNotAvailable: 'PDF алдын-ала қарау қолданбада қол жетімді емес',
    openInExternalApp: 'Сыртқы қолданбада ашу'
  }
};
