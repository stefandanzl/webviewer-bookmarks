/* eslint-disable @typescript-eslint/no-inferrable-types */
import { App, Plugin, PluginSettingTab, Setting, Notice } from "obsidian";

interface Bookmark {
	url: string;
	ribbon: boolean;
	command: boolean;
	newTab: boolean;
	lucide: string;
}

interface WebViewerBookmarksSettings {
	bookmarks: Bookmark[];
}

const DEFAULT_SETTINGS: WebViewerBookmarksSettings = {
	bookmarks: [],
};

export default class WebViewerBookmarksPlugin extends Plugin {
	settings: WebViewerBookmarksSettings;

	async onload() {
		await this.loadSettings();

		// Add settings tab
		this.addSettingTab(new WebViewerBookmarksSettingTab(this.app, this));

		// Setup bookmarks
		this.setupBookmarks();
	}

	setupBookmarks() {
		// Clear existing commands and ribbons
		this.clearBookmarks();

		// Setup each bookmark
		this.settings.bookmarks.forEach((bookmark, index) => {
			const iconName = bookmark.lucide || "bookmark";

			// Add command if enabled
			if (bookmark.command) {
				this.addCommand({
					id: `open-webviewer-bookmark-${index}`,
					name: `Open Web Viewer Bookmark: ${this.getDisplayName(
						bookmark
					)}`,
					callback: () => {
						this.openBookmark(bookmark);
					},
				});
			}

			// Add ribbon if enabled
			if (bookmark.ribbon) {
				this.addRibbonIcon(
					iconName,
					`Open ${this.getDisplayName(bookmark)}`,
					(evt: MouseEvent) => {
						// Middle click or if newTab is true
						if (evt.button === 1 || bookmark.newTab) {
							this.openBookmark(bookmark, true);
						} else {
							this.openBookmark(bookmark, false);
						}
					}
				);
			}
		});
	}

	clearBookmarks() {
		// Commands are automatically cleared on plugin unload
		// We just need to remove any ribbon icons we've added
		// This happens automatically when the plugin is reloaded
	}

	getDisplayName(bookmark: Bookmark): string {
		try {
			const url = new URL(bookmark.url);
			return url.hostname;
		} catch (e) {
			return bookmark.url;
		}
	}

	openBookmark(bookmark: Bookmark, forceNewTab: boolean = false) {
		// Use type assertion to access internal plugins
		// @ts-ignore - using internal API
		const internalPlugins = this.app.internalPlugins;
		const webViewer = internalPlugins.getPluginById("webviewer");

		if (!webViewer || !webViewer.enabled) {
			new Notice("Web Viewer plugin is not enabled");
			console.error("Web Viewer plugin is not enabled");
			return;
		}

		const openInNewTab = forceNewTab || bookmark.newTab;

		// Access through window to bypass TypeScript restrictions
		// @ts-ignore - using internal API
		this.app.internalPlugins
			.getEnabledPluginById("webviewer")
			.openUrl(bookmark.url, openInNewTab);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		//this.setupBookmarks();
	}

	async reloadApp() {
		// Access through window to bypass TypeScript restrictions
		// @ts-ignore - using internal API
		this.app.commands.executeCommandById("app:reload");
	}
}

class WebViewerBookmarksSettingTab extends PluginSettingTab {
	plugin: WebViewerBookmarksPlugin;

	constructor(app: App, plugin: WebViewerBookmarksPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Web Viewer Bookmarks Settings" });

		new Setting(containerEl)
			.setDesc("Manage your bookmarks for the Web Viewer plugin")
			.addButton((button) => {
				button
					.setButtonText("Add Bookmark")
					.setCta()
					.onClick(() => {
						this.plugin.settings.bookmarks.push({
							url: "https://",
							ribbon: false,
							command: true,
							newTab: false,
							lucide: "bookmark",
						});
						this.plugin.saveSettings();
						this.display();
					});
			});

		const iconHelp = containerEl.createEl("div", {
			cls: "setting-item-description",
		});

		iconHelp.createSpan({
			text: "For icons, enter Lucide icon names. Find all available icons at: ",
		});

		iconHelp.createEl("a", {
			text: "Lucide Icons",
			href: "https://lucide.dev/icons",
		});

		iconHelp.createEl("p", {
			text: "Obsidian uses Lucide icons by default. Example icon names: bookmark, globe, link, heart, external-link",
		});

		this.plugin.settings.bookmarks.forEach((bookmark, index) => {
			// Create a div for each bookmark
			const bookmarkDiv = containerEl.createDiv({
				cls: "bookmark-container",
			});

			// Add a header for each bookmark
			const headerDiv = bookmarkDiv.createDiv({
				cls: "bookmark-header-div",
			});

			headerDiv.createEl("h3", {
				text: `Bookmark: ${this.plugin.getDisplayName(bookmark)}`,
				cls: "bookmark-header",
			});
			headerDiv
				.createEl("button", {
					cls: "mod-warning",
					text: "Remove",
				})
				.addEventListener("click", async (e) => {
					this.plugin.settings.bookmarks.splice(index, 1);
					await this.plugin.saveSettings();
					this.display();
				});

			// URL Setting
			new Setting(bookmarkDiv)
				.setName("URL")
				.setDesc("The website address to open in Web Viewer")
				.addText((text) => {
					text.setPlaceholder("https://")
						.setValue(bookmark.url)
						.onChange(async (value) => {
							this.plugin.settings.bookmarks[index].url = value;
							await this.plugin.saveSettings();
						});
				});

			// Icon Setting
			new Setting(bookmarkDiv)
				.setName("Icon")
				.setDesc("Lucide icon name to display in the ribbon")
				.addText((text) => {
					text.setPlaceholder("bookmark")
						.setValue(bookmark.lucide)
						.onChange(async (value) => {
							this.plugin.settings.bookmarks[index].lucide =
								value;
							await this.plugin.saveSettings();
						});
				});

			// Ribbon Toggle Setting
			new Setting(bookmarkDiv)
				.setName("Show in Ribbon")
				.setDesc("Display this bookmark as an icon in the ribbon")
				.addToggle((toggle) => {
					toggle.setValue(bookmark.ribbon).onChange(async (value) => {
						this.plugin.settings.bookmarks[index].ribbon = value;
						await this.plugin.saveSettings();
					});
				});

			// Command Toggle Setting
			new Setting(bookmarkDiv)
				.setName("Create Command")
				.setDesc("Create a command to open this bookmark")
				.addToggle((toggle) => {
					toggle
						.setValue(bookmark.command)
						.onChange(async (value) => {
							this.plugin.settings.bookmarks[index].command =
								value;
							await this.plugin.saveSettings();
						});
				});

			// New Tab Toggle Setting
			new Setting(bookmarkDiv)
				.setName("Open in New Tab")
				.setDesc("Open this bookmark in a new tab by default")
				.addToggle((toggle) => {
					toggle.setValue(bookmark.newTab).onChange(async (value) => {
						this.plugin.settings.bookmarks[index].newTab = value;
						await this.plugin.saveSettings();
					});
				});
		});

		new Setting(containerEl)
			.setName("Reload App")
			.setDesc("Reload Obsidian for changes to ribbons")
			.addButton((button) => {
				button
					.setButtonText("Reload")
					.setCta()
					.onClick(() => this.plugin.reloadApp());
			});
	}
}
