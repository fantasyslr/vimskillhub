import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'zh'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextType | undefined>(undefined)

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    'nav.explore': 'Explore',
    'nav.upload': 'Upload',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.signout': 'Sign out',
    'nav.profile': 'Profile',
    'nav.footer': 'Vim Technology & Eazillion Internal Platform',

    // Home
    'home.subtitle': 'Discover, share, and collaborate on skills across the team.',
    'home.companies': '{vim} & {eaz} internal platform.',
    'home.explore': 'Explore Skills',
    'home.share': 'Share a Skill',
    'home.skills_shared': 'Skills Shared',
    'home.team_members': 'Team Members',
    'home.total_downloads': 'Total Downloads',
    'home.how_it_works': 'How it works',
    'home.how_subtitle': 'Three steps to share knowledge across the team',
    'home.step1_title': 'Upload',
    'home.step1_desc': 'Package your skill and share it with the team via file upload or GitHub link.',
    'home.step2_title': 'Discover',
    'home.step2_desc': 'Browse, search, and filter skills by category. Star and rate the ones you love.',
    'home.step3_title': 'Use',
    'home.step3_desc': 'One-click download. Read docs, check ratings and comments before you start.',
    'home.featured': 'Featured Skills',
    'home.featured_sub': 'Most starred skills from the team',
    'home.view_all': 'View all',
    'home.no_skills': 'No skills published yet',
    'home.be_first': 'Be the first to share',

    // Explore
    'explore.title': 'Explore Skills',
    'explore.search': 'Search skills...',
    'explore.all': 'All',
    'explore.newest': 'Newest',
    'explore.most_stars': 'Most Stars',
    'explore.most_downloads': 'Most Downloads',
    'explore.highest_rated': 'Highest Rated',
    'explore.no_results': 'No skills found matching your criteria.',
    'explore.load_more': 'Load More',
    'explore.loading': 'Loading...',

    // Skill Detail
    'skill.documentation': 'Documentation',
    'skill.tags': 'Tags',
    'skill.rating': 'Rating',
    'skill.your_rating': 'Your rating:',
    'skill.sign_in_rate': 'Sign in to rate this skill.',
    'skill.comments': 'Comments',
    'skill.no_comments': 'No comments yet. Be the first to share your thoughts.',
    'skill.add_comment': 'Add a comment...',
    'skill.send': 'Send',
    'skill.sign_in_comment': 'Sign in to leave a comment.',
    'skill.stats': 'Stats',
    'skill.stars': 'Stars',
    'skill.downloads': 'Downloads',
    'skill.version': 'Version',
    'skill.author': 'Author',
    'skill.download_file': 'Download',
    'skill.get_github': 'Get from GitHub',
    'skill.view_github': 'View on GitHub',
    'skill.star': 'Star',
    'skill.starred': 'Starred',
    'skill.not_found': 'Skill not found.',
    'skill.back': 'Back to Explore',
    'skill.ratings': 'ratings',
    'skill.rating_singular': 'rating',
    'skill.sign_in': 'Sign in',

    // Upload
    'upload.title': 'Publish a Skill',
    'upload.subtitle': 'Share your work with the team',
    'upload.field_title': 'Title',
    'upload.field_desc': 'Short Description',
    'upload.field_docs': 'Documentation',
    'upload.field_docs_hint': '(Markdown supported)',
    'upload.field_category': 'Category',
    'upload.field_category_select': 'Select a category',
    'upload.field_tags': 'Tags',
    'upload.field_tags_hint': '(comma separated)',
    'upload.field_version': 'Version',
    'upload.field_github': 'GitHub URL',
    'upload.field_file': 'File Upload',
    'upload.optional': '(optional)',
    'upload.required': '*',
    'upload.submit': 'Publish Skill',
    'upload.submitting': 'Publishing...',
    'upload.title_required': 'Title is required.',
    'upload.desc_required': 'Description is required.',
    'upload.category_required': 'Category is required.',

    // Login
    'login.welcome': 'Welcome back',
    'login.subtitle': 'Sign in to VimSkillHub',
    'login.email': 'Email address',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.submitting': 'Signing in...',
    'login.no_account': 'New to VimSkillHub?',
    'login.create': 'Create an account',

    // Register
    'register.title': 'Create your account',
    'register.subtitle': 'Join VimSkillHub with your company email',
    'register.name': 'Display name',
    'register.email': 'Company email',
    'register.email_hint': 'Only @eazillion.com and @vim-technology.com emails are accepted.',
    'register.password': 'Password',
    'register.password_hint': 'At least 6 characters',
    'register.submit': 'Create account',
    'register.submitting': 'Creating account...',
    'register.has_account': 'Already have an account?',
    'register.sign_in': 'Sign in',
    'register.password_short': 'Password must be at least 6 characters.',

    // Profile
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.name_label': 'Display Name',
    'profile.bio_label': 'Bio',
    'profile.avatar_label': 'Avatar URL',
    'profile.my_skills': 'My Skills',
    'profile.user_skills': "'s Skills",
    'profile.no_skills_own': "You haven't published any skills yet.",
    'profile.no_skills_other': "This user hasn't published any skills yet.",
    'profile.not_found': 'Profile not found.',
    'profile.skills': 'Skills',
    'profile.joined': 'Joined',
    'profile.name_required': 'Display name is required.',

    // Categories
    'cat.automation': 'Automation',
    'cat.integration': 'Integration',
    'cat.analytics': 'Analytics',
    'cat.ui-component': 'UI Component',
    'cat.data-processing': 'Data Processing',
    'cat.workflow': 'Workflow',
    'cat.utility': 'Utility',
    'cat.other': 'Other',
  },
  zh: {
    // Nav
    'nav.explore': '探索',
    'nav.upload': '上传',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.signout': '退出',
    'nav.profile': '个人主页',
    'nav.footer': 'Vim Technology & Eazillion 内部平台',

    // Home
    'home.subtitle': '在团队中发现、分享和协作技能。',
    'home.companies': '{vim} & {eaz} 内部平台。',
    'home.explore': '探索技能',
    'home.share': '分享技能',
    'home.skills_shared': '已分享技能',
    'home.team_members': '团队成员',
    'home.total_downloads': '总下载量',
    'home.how_it_works': '使用流程',
    'home.how_subtitle': '三步分享团队知识',
    'home.step1_title': '上传',
    'home.step1_desc': '打包你的技能，通过文件上传或 GitHub 链接分享给团队。',
    'home.step2_title': '发现',
    'home.step2_desc': '按分类浏览、搜索和筛选技能。给喜欢的打星和评分。',
    'home.step3_title': '使用',
    'home.step3_desc': '一键下载。阅读文档，查看评分和评论后开始使用。',
    'home.featured': '精选技能',
    'home.featured_sub': '团队中最多 Star 的技能',
    'home.view_all': '查看全部',
    'home.no_skills': '还没有已发布的技能',
    'home.be_first': '成为第一个分享者',

    // Explore
    'explore.title': '探索技能',
    'explore.search': '搜索技能...',
    'explore.all': '全部',
    'explore.newest': '最新',
    'explore.most_stars': '最多 Star',
    'explore.most_downloads': '最多下载',
    'explore.highest_rated': '最高评分',
    'explore.no_results': '没有找到匹配的技能。',
    'explore.load_more': '加载更多',
    'explore.loading': '加载中...',

    // Skill Detail
    'skill.documentation': '文档',
    'skill.tags': '标签',
    'skill.rating': '评分',
    'skill.your_rating': '你的评分：',
    'skill.sign_in_rate': '登录后可评分。',
    'skill.comments': '评论',
    'skill.no_comments': '暂无评论，来分享你的想法吧。',
    'skill.add_comment': '添加评论...',
    'skill.send': '发送',
    'skill.sign_in_comment': '登录后可评论。',
    'skill.stats': '统计',
    'skill.stars': 'Stars',
    'skill.downloads': '下载量',
    'skill.version': '版本',
    'skill.author': '作者',
    'skill.download_file': '下载',
    'skill.get_github': '从 GitHub 获取',
    'skill.view_github': '在 GitHub 查看',
    'skill.star': '收藏',
    'skill.starred': '已收藏',
    'skill.not_found': '技能未找到。',
    'skill.back': '返回探索',
    'skill.ratings': '个评分',
    'skill.rating_singular': '个评分',
    'skill.sign_in': '登录',

    // Upload
    'upload.title': '发布技能',
    'upload.subtitle': '与团队分享你的成果',
    'upload.field_title': '标题',
    'upload.field_desc': '简短描述',
    'upload.field_docs': '文档说明',
    'upload.field_docs_hint': '（支持 Markdown）',
    'upload.field_category': '分类',
    'upload.field_category_select': '选择分类',
    'upload.field_tags': '标签',
    'upload.field_tags_hint': '（逗号分隔）',
    'upload.field_version': '版本号',
    'upload.field_github': 'GitHub 链接',
    'upload.field_file': '上传文件',
    'upload.optional': '（可选）',
    'upload.required': '*',
    'upload.submit': '发布技能',
    'upload.submitting': '发布中...',
    'upload.title_required': '标题不能为空。',
    'upload.desc_required': '描述不能为空。',
    'upload.category_required': '请选择分类。',

    // Login
    'login.welcome': '欢迎回来',
    'login.subtitle': '登录 VimSkillHub',
    'login.email': '邮箱地址',
    'login.password': '密码',
    'login.submit': '登录',
    'login.submitting': '登录中...',
    'login.no_account': '还没有账号？',
    'login.create': '创建账号',

    // Register
    'register.title': '创建账号',
    'register.subtitle': '使用公司邮箱加入 VimSkillHub',
    'register.name': '显示名称',
    'register.email': '公司邮箱',
    'register.email_hint': '仅限 @eazillion.com 和 @vim-technology.com 邮箱注册。',
    'register.password': '密码',
    'register.password_hint': '至少 6 个字符',
    'register.submit': '创建账号',
    'register.submitting': '创建中...',
    'register.has_account': '已有账号？',
    'register.sign_in': '登录',
    'register.password_short': '密码至少需要 6 个字符。',

    // Profile
    'profile.edit': '编辑资料',
    'profile.save': '保存',
    'profile.cancel': '取消',
    'profile.name_label': '显示名称',
    'profile.bio_label': '个人简介',
    'profile.avatar_label': '头像链接',
    'profile.my_skills': '我的技能',
    'profile.user_skills': ' 的技能',
    'profile.no_skills_own': '你还没有发布任何技能。',
    'profile.no_skills_other': '该用户还没有发布任何技能。',
    'profile.not_found': '用户未找到。',
    'profile.skills': '技能',
    'profile.joined': '加入于',
    'profile.name_required': '显示名称不能为空。',

    // Categories
    'cat.automation': '自动化',
    'cat.integration': '集成',
    'cat.analytics': '数据分析',
    'cat.ui-component': 'UI 组件',
    'cat.data-processing': '数据处理',
    'cat.workflow': '工作流',
    'cat.utility': '工具',
    'cat.other': '其他',
  },
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('vimskillhub-lang')
    return (saved === 'zh' || saved === 'en') ? saved : 'zh'
  })

  function handleSetLang(newLang: Lang) {
    setLang(newLang)
    localStorage.setItem('vimskillhub-lang', newLang)
  }

  function t(key: string): string {
    return translations[lang][key] ?? key
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return context
}
