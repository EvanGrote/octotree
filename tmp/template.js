const TEMPLATE = '<div>\n' +
    '  <nav class="octotree_sidebar">\n' +
    '    <a class="octotree_toggle btn">\n' +
    '      <div class="loader"></div>\n' +
    '      <span></span>\n' +
    '\n' +
    '      <div class="popup">\n' +
    '        <div class="arrow"></div>\n' +
    '        <div class="content">\n' +
    '          Octotree is enabled on this page. Click this button or press\n' +
    '          <kbd>cmd shift s</kbd> (or <kbd>ctrl shift s</kbd>)\n' +
    '          to show it.\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </a>\n' +
    '\n' +
    '    <a class="octotree_opts" href="javascript:void(0)">\n' +
    '      <i class="settings"></i>\n' +
    '    </a>\n' +
    '\n' +
    '    <div class="octotree_views">\n' +
    '      <div class="octotree_view octotree_treeview current">\n' +
    '        <div class="octotree_view_header"></div>\n' +
    '        <div class="octotree_view_body"></div>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree_view octotree_errorview">\n' +
    '        <div class="octotree_view_header"></div>\n' +
    '        <form class="octotree_view_body">\n' +
    '          <div class="message"></div>\n' +
    '          <div>\n' +
    '            <input name="token" type="text" placeholder="Paste access token here" autocomplete="off">\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <button type="submit" class="btn">Save</button>\n' +
    '            <a href="https://github.com/ovity/octotree#access-token" target="_blank" tabIndex="-1">Why is this required?</a>\n' +
    '          </div>\n' +
    '          <div class="error"></div>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree_view octotree_optsview">\n' +
    '        <div class="octotree_view_header">Settings</div>\n' +
    '        <form class="octotree_view_body">\n' +
    '          <div>\n' +
    '            <label>Site access token</label>\n' +
    '            <a class="octotree_help" href="https://github.com/ovity/octotree#settings" target="_blank" tabIndex="-1">\n' +
    '              <span></span>\n' +
    '            </a>\n' +
    '            <input type="text" data-store="TOKEN" data-perhost="true">\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <div>\n' +
    '              <label>Hotkeys</label>\n' +
    '            </div>\n' +
    '            <input type="text" data-store="HOTKEYS">\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="ICONS"> Show file-specific icons</label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="REMEMBER"> Remember sidebar visibility</label>\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="NONCODE"> Show in non-code pages</label>\n' +
    '          </div>\n' +
    '\n' +
    '          <div class="octotree_github_only">\n' +
    '            <label><input type="checkbox" data-store="LOADALL"> Load entire tree at once</label>\n' +
    '          </div>\n' +
    '\n' +
    '          <div class="octotree_github_only">\n' +
    '            <label>\n' +
    '              <input type="checkbox" data-store="PR">\n' +
    '                Show only pull request changes\n' +
    '              <span class="octotree_opts_disclaimer">Note: maximum of 300 files</span>\n' +
    '            </label>\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <button type="submit" class="btn">Save</button>\n' +
    '          </div>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree_bottom">\n' +
    '      <a href="https://opencollective.com/octotree" target="_blank">\n' +
    '        <i class="support"></i>Support us\n' +
    '      </a>\n' +
    '      &nbsp;•&nbsp;\n' +
    '      <a href="https://github.com/ovity/octotree/issues/new" target="_blank">\n' +
    '        <i class="github"></i>Feedback?\n' +
    '      </a>\n' +
    '    </div>\n' +
    '  </nav>\n' +
    '</div>\n' +
    ''