const GH_RESERVED_USER_NAMES = [
  'settings', 'orgs', 'organizations',
  'site', 'blog', 'about', 'explore',
  'styleguide', 'showcases', 'trending',
  'stars', 'dashboard', 'notifications',
  'search', 'developer', 'account',
  'pulls', 'issues', 'features', 'contact',
  'security', 'join', 'login', 'watching',
  'new', 'integrations'
]
const GH_RESERVED_REPO_NAMES = ['followers', 'following', 'repositories']
const GH_404_SEL = '#parallax_wrapper'
const GH_PJAX_SEL = '#js-repo-pjax-container'
const GH_CONTAINERS = '.container'

class GitHub extends Adapter {

  constructor() {
    super()
    $(document)
      .ready(() => this._detectLocationChange())
      .on('pjax:send', () => $(document).trigger(EVENT.REQ_START))
      .on('pjax:end', () => $(document).trigger(EVENT.REQ_END))
      .on('pjax:timeout', (event) => event.preventDefault())
  }

  // @override
  getCssClass() {
    return 'octotree_github_sidebar'
  }

  // @override
  canLoadEntireTree() {
    return true
  }

  // @override
  getCreateTokenUrl() {
    return `${location.protocol}//${location.host}/settings/tokens/new`
  }

  // @override
  updateLayout(togglerVisible, sidebarVisible, sidebarWidth) {
    const SPACING = 10
    const $containers = $(GH_CONTAINERS)

    if ($containers.length === 4) {
      const autoMarginLeft = ($('body').width() - $containers.width()) / 2
      const shouldPushLeft = sidebarVisible && (autoMarginLeft <= sidebarWidth + SPACING)
      $containers.css('margin-left', shouldPushLeft ? sidebarWidth + SPACING : '')
    }

    // falls-back if GitHub DOM has been updated
    else $('html').css('margin-left', sidebarVisible ? sidebarWidth + SPACING : '')
  }

  // @override
  getRepoFromPath(showInNonCodePage, currentRepo, token, cb) {

    // 404 page, skip
    if ($(GH_404_SEL).length) {
      return cb()
    }

    // (username)/(reponame)[/(type)]
    const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?/)
    if (!match) {
      return cb()
    }

    const username = match[1]
    const reponame = match[2]

    // not a repository, skip
    if (~GH_RESERVED_USER_NAMES.indexOf(username) ||
        ~GH_RESERVED_REPO_NAMES.indexOf(reponame)) {
      return cb()
    }

    // skip non-code page unless showInNonCodePage is true
    if (!showInNonCodePage && match[3] && !~['tree', 'blob'].indexOf(match[3])) {
      return cb()
    }

    // get branch by inspecting page, quite fragile so provide multiple fallbacks
    const GH_BRANCH_SEL_1 = '[aria-label="Switch branches or tags"]'
    const GH_BRANCH_SEL_2 = '.repo-root a[data-branch]'
    const GH_BRANCH_SEL_3 = '.repository-sidebar a[aria-label="Code"]'

    const branch =
      // Code page
      $(GH_BRANCH_SEL_1).attr('title') || $(GH_BRANCH_SEL_2).data('branch') ||
      // Non-code page
      ($(GH_BRANCH_SEL_3).attr('href') || '').match(/([^\/]+)/g)[3] ||
      // Assume same with previously
      (currentRepo.username === username && currentRepo.reponame === reponame && currentRepo.branch) ||
      // Default from cache
      this._defaultBranch[username + '/' + reponame]

    const repo = {username: username, reponame: reponame, branch: branch}

    if (repo.branch) {
      cb(null, repo)
    }
    else {
      this._get(null, {repo, token}, (err, data) => {
        if (err) return cb(err)
        repo.branch = this._defaultBranch[username + '/' + reponame] = data.default_branch || 'master'
        cb(null, repo)
      })
    }
  }

  // @override
  selectFile(path) {
    const container = $(GH_PJAX_SEL)

    if (container.length) {
      $.pjax({
        // needs full path for pjax to work with Firefox as per cross-domain-content setting
        url : location.protocol + '//' + location.host + path,
        container : container
      })
    }
    else { // falls back
      super.selectFile(path)
    }
  }

  // @override
  loadCodeTree(opts, cb) {
    opts.encodedBranch = encodeURIComponent(decodeURIComponent(opts.repo.branch))
    opts.path = (opts.node && (opts.node.sha || opts.encodedBranch)) ||
                (opts.encodedBranch + '?recursive=1')
    this._loadCodeTree(opts, null, cb)
  }

  // @override
  _getTree(path, opts, cb) {
    this._get(`/git/trees/${path}`, opts, (err, res) => {
      if (err) return cb(err)
      cb(null, res.tree)
    })
  }

  // @override
  _getSubmodules(tree, opts, cb) {
    const item = tree.filter((item) => /^\.gitmodules$/i.test(item.path))[0]
    if (!item) return cb()

    this._get(`/git/blobs/${item.sha}`, opts, (err, res) => {
      if (err) return cb(err)
      const data = atob(res.content.replace(/\n/g,''))
      cb(null, parseGitmodules(data))
    })
  }

  _get(path, opts, cb) {
    const host = location.protocol + '//' +
      (location.host === 'github.com' ? 'api.github.com' : (location.host + '/api/v3'))
    const url = `${host}/repos/${opts.repo.username}/${opts.repo.reponame}${path || ''}`
    const cfg  = { url, method: 'GET', cache: false }

    if (opts.token) {
      cfg.headers = { Authorization: 'token ' + opts.token }
    }

    $.ajax(cfg)
      .done((data) => cb(null, data))
      .fail((jqXHR) => this._handleError(jqXHR, cb))
  }

  /**
   * When navigating from non-code pages (i.e. Pulls, Issues) to code page
   * GitHub doesn't reload the page but uses pjax. Need to detect and load Octotree.
   */
  _detectLocationChange() {
    let firstLoad = true, href, hash

    function detect() {
      if (location.href !== href || location.hash !== hash) {
        href = location.href
        hash = location.hash

        // If this is the first time this is called, no need to notify change as
        // Octotree does its own initialization after loading options.
        if (firstLoad) {
          firstLoad = false
        }
        else {
          setTimeout(() => {
            $(document).trigger(EVENT.LOC_CHANGE, href, hash)
          }, 200) // Waits a bit for pjax DOM change
        }
      }

      setTimeout(detect, 200)
    }
    detect()
  }
}