// Define all translations for the app

export type Language = 'kk' | 'ru' | 'en';

export type TranslationKeys = {
  // General
  appName: string;
  
  // Theme Settings
  appearance: string;
  themeMode: string;
  themeColor: string;
  
  // Auth Screens
  login: string;
  register: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  enterEmail: string;
  enterPassword: string;
  enterFullName: string;
  confirmYourPassword: string;
  signIn: string;
  signUp: string;
  welcomeBack: string;
  createAccount: string;
  getStarted: string;

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
};

export const translations: Record<Language, TranslationKeys> = {
  // EN translations
  en: {
    // General
    appName: 'Trackit',
    
    // Theme Settings
    appearance: 'Appearance',
    themeMode: 'Theme Mode',
    themeColor: 'Theme Color',
    
    // Auth Screens
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterFullName: 'Enter your full name',
    confirmYourPassword: 'Confirm your password',
    signIn: 'SIGN IN',
    signUp: 'SIGN UP',
    welcomeBack: 'Welcome back!',
    createAccount: 'Create an account',
    getStarted: 'Get started with the app',
    
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
  },
  
  // Kazakh translations
  kk: {
    // General
    appName: 'Trackit',
    
    // Theme Settings
    appearance: 'Сыртқы көрініс',
    themeMode: 'Тақырып режимі',
    themeColor: 'Тақырып түсі',
    
    // Auth Screens
    login: 'Кіру',
    register: 'Тіркелу',
    email: 'Электрондық пошта',
    password: 'Құпия сөз',
    confirmPassword: 'Құпия сөзді растаңыз',
    fullName: 'Толық аты-жөні',
    forgotPassword: 'Құпия сөзіңізді ұмыттыңыз ба?',
    dontHaveAccount: 'Тіркелгіңіз жоқ па?',
    alreadyHaveAccount: 'Тіркелгіңіз бар ма?',
    enterEmail: 'Электрондық поштаңызды енгізіңіз',
    enterPassword: 'Құпия сөзіңізді енгізіңіз',
    enterFullName: 'Толық аты-жөніңізді енгізіңіз',
    confirmYourPassword: 'Құпия сөзді растаңыз',
    signIn: 'КІРУ',
    signUp: 'ТІРКЕЛУ',
    welcomeBack: 'Қайта келгеніңізге қуаныштымыз!',
    createAccount: 'Тіркелгі жасау',
    getStarted: 'Қосымша жұмысын бастау үшін тіркеліңіз',
    
    // Tab Navigation
    home: 'Басты',
    analysis: 'Талдау',
    orders: 'Тапсырыстар',
    profile: 'Профиль',
    
    // Home Tab
    dashboard: 'Басқару тақтасы',
    orderCompletionRate: 'Тапсырыс орындалу көрсеткіші',
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
    logisticsAnalytics: 'Логистикалық талдау',
    orderStatistics: 'Тапсырыс статистикасы',
    today: 'Бүгін',
    thisWeek: 'Осы апта',
    thisMonth: 'Осы ай',
    averageOrderValue: 'Орташа тапсырыс құны',
    topVehicleTypes: 'Үздік көлік түрлері',
    topProducts: 'Үздік өнімдер',
    orderTrends: 'Тапсырыс трендтері',
    
    // Orders Tab
    newOrders: 'Жаңа тапсырыстар',
    myOrders: 'Менің тапсырыстарым',
    all: 'Барлығы',
    inProgress: 'Процесте',
    cancelled: 'Бас тартылған',
    customer: 'Тұтынушы',
    origin: 'Шығу орны',
    destination: 'Баратын жер',
    vehicle: 'Көлік',
    product: 'Өнім',
    weight: 'Салмақ',
    price: 'Баға',
    driver: 'Жүргізуші',
    eta: 'Болжалды келу уақыты',
    deliveredOn: 'Жеткізілу күні',
    reason: 'Себеп',
    trackOrder: 'Тапсырысты бақылау',
    acceptOrder: 'Тапсырысты қабылдау',
    viewDetails: 'Толығырақ көру',
    reject: 'Бас тарту',
    noOrdersFound: 'Тапсырыстар табылмады',
    noNewOrders: 'Жаңа тапсырыстар жоқ',
    
    // Filter Options
    showFilters: 'Сүзгілерді көрсету',
    hideFilters: 'Сүзгілерді жасыру',
    vehicleType: 'Көлік түрі',
    productType: 'Өнім түрі',
    priceRange: 'Баға диапазоны',
    
    // Profile Page
    personalInfo: 'Жеке ақпарат',
    phone: 'Телефон',
    company: 'Компания',
    language: 'Тіл',
    selectLanguage: 'Тілді таңдаңыз',
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
  },
  
  // Russian translations
  ru: {
    // General
    appName: 'Trackit',
    
    // Theme Settings
    appearance: 'Внешний вид',
    themeMode: 'Режим темы',
    themeColor: 'Цвет темы',
    
    // Auth Screens
    login: 'Вход',
    register: 'Регистрация',
    email: 'Электронная почта',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    fullName: 'Полное имя',
    forgotPassword: 'Забыли пароль?',
    dontHaveAccount: 'Нет аккаунта?',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    enterEmail: 'Введите вашу почту',
    enterPassword: 'Введите ваш пароль',
    enterFullName: 'Введите ваше полное имя',
    confirmYourPassword: 'Подтвердите ваш пароль',
    signIn: 'ВОЙТИ',
    signUp: 'ЗАРЕГИСТРИРОВАТЬСЯ',
    welcomeBack: 'Добро пожаловать!',
    createAccount: 'Создать аккаунт',
    getStarted: 'Зарегистрируйтесь, чтобы начать работу с приложением',
    
    // Tab Navigation
    home: 'Главная',
    analysis: 'Анализ',
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
    thisWeek: 'На этой неделе',
    thisMonth: 'В этом месяце',
    averageOrderValue: 'Средняя стоимость заказа',
    topVehicleTypes: 'Популярные типы транспорта',
    topProducts: 'Популярные товары',
    orderTrends: 'Тенденции заказов',
    
    // Orders Tab
    newOrders: 'Новые заказы',
    myOrders: 'Мои заказы',
    all: 'Все',
    inProgress: 'В процессе',
    cancelled: 'Отменены',
    customer: 'Клиент',
    origin: 'Откуда',
    destination: 'Куда',
    vehicle: 'Транспорт',
    product: 'Товар',
    weight: 'Вес',
    price: 'Цена',
    driver: 'Водитель',
    eta: 'Ожидаемое прибытие',
    deliveredOn: 'Доставлено',
    reason: 'Причина',
    trackOrder: 'Отследить заказ',
    acceptOrder: 'Принять заказ',
    viewDetails: 'Подробнее',
    reject: 'Отклонить',
    noOrdersFound: 'Заказы не найдены',
    noNewOrders: 'Нет новых заказов',
    
    // Filter Options
    showFilters: 'Показать фильтры',
    hideFilters: 'Скрыть фильтры',
    vehicleType: 'Тип транспорта',
    productType: 'Тип продукта',
    priceRange: 'Ценовой диапазон',
    
    // Profile Page
    personalInfo: 'Личная информация',
    phone: 'Телефон',
    company: 'Компания',
    language: 'Язык',
    selectLanguage: 'Выберите язык',
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
  }
};