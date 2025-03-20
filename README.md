# 'Web Viewer Bookmarks' Community Plugin for Obsidian

A simple plugin for Obsidian that allows you to create and manage bookmarks for websites using Obsidian's built-in web viewer.

## Features

- Create and manage website bookmarks for quick access in Obsidian's built-in web viewer
- Add bookmarks to the Obsidian ribbon for one-click access
- Access bookmarks via commands in the command palette
- Customize bookmark icons using Lucide icon names

## Installation

1. In Obsidian, go to Settings → Community plugins
2. Disable Safe mode
3. Click "Browse" and search for "Web Viewer Bookmarks"
4. Install the plugin
5. Enable the plugin in your list of installed plugins

### Manual Installation

1. Create a folder named `webviewer-bookmarks` in your vault's `.obsidian/plugins/` directory
2. Download the `main.js`, `manifest.json`, and `styles.css` files from the latest release
3. Add them to the plugin folder
4. Enable the plugin in your Obsidian settings


### Managing Bookmarks

1. Go to Settings → Web Viewer Bookmarks
2. Here you can:
   - Add bookmarks
   - Edit existing bookmarks
   - Delete bookmarks
   - Change icons

### Customizing Icons

The plugin uses [Lucide icons](https://lucide.dev/icons/) for bookmark visuals. To set an icon:

1. Browse the Lucide icon library to find the icon name you want
2. Enter the icon name exactly as it appears (e.g., "book-marked", "globe", "bookmark")

### Ribbon and Command Integration

For each bookmark, you can choose to:
- Add a ribbon icon for one-click access
- Create a command in the command palette

**Note:** After making changes to bookmarks, Obsidian must be reloaded for the changes to take effect.


## Troubleshooting

- **Bookmarks not appearing:** Reload Obsidian after making changes
- **Icons not displaying correctly:** Ensure you're using valid Lucide icon names
- **Web viewer not opening:** Check that Obsidian's built-in web viewer is enabled


## Support

If you encounter any issues or have feature requests, please file an issue on the GitHub repository.

## License

This plugin is licensed under the MIT License.

## Credits

- Built for Obsidian's API
- Uses [Lucide icons](https://lucide.dev)
- Inspired by the needs of the Obsidian community
