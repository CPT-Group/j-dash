# Publishing Guide for Cursor IDE Extension

This guide will walk you through publishing the Dark Synth theme to Cursor's extension marketplace.

## Prerequisites

1. **Cursor IDE Account**: You need a Cursor IDE account
2. **Extension Package**: The `.vsix` file we just built
3. **Publisher Account**: Access to publish extensions

## Publishing Steps

### 1. Prepare Your Extension

✅ **Already Done:**
- Theme converted from VS Code to Cursor IDE
- Package built successfully (`dark-synth-cursor-1.0.0.vsix`)
- All metadata updated for Cursor IDE
- README and documentation updated

### 2. Publish to Cursor Extension Marketplace

#### Option A: Through Cursor IDE (Recommended)
1. Open Cursor IDE
2. Go to **Extensions** (Ctrl+Shift+X or Cmd+Shift+X)
3. Click on the **...** menu (three dots)
4. Select **Install from VSIX...**
5. Choose your `dark-synth-cursor-1.0.0.vsix` file
6. The theme will be installed locally

#### Option B: Manual Installation
1. Copy the `themes` folder to your Cursor IDE extensions directory
2. Restart Cursor IDE
3. Go to `File > Preferences > Color Theme > Dark Synth`

### 3. Testing Your Theme

1. **Install the theme** using one of the methods above
2. **Select the theme**: `File > Preferences > Color Theme > Dark Synth`
3. **Test with different file types**: Open various code files to ensure proper highlighting
4. **Check UI elements**: Verify sidebar, tabs, and other UI elements are properly themed

### 4. Publishing to Cursor's Extension Marketplace

Currently, Cursor IDE uses VS Code's extension marketplace, so you can:

1. **Publish to VS Code Marketplace** (which Cursor can access):
   ```bash
   npm run publish
   ```
   
2. **Manual Distribution**:
   - Share the `.vsix` file directly
   - Host on GitHub releases
   - Distribute through your own channels

## Extension Structure

```
dark-synth-cursor/
├── package.json              # Extension metadata
├── themes/
│   └── Dark Synth-color-theme.json  # Theme definition
├── images/                   # Icons and previews
├── examples/                 # Code examples for preview
├── README.md                 # Documentation
├── CHANGELOG.md             # Version history
└── LICENSE                   # MIT License
```

## Key Features

- **Dark Purple/Cyan Theme**: Easy on the eyes
- **Semantic Highlighting**: Enhanced code readability
- **Synthwave Aesthetics**: Modern dark theme with 80s vibes
- **Cursor IDE Optimized**: Tested and optimized for Cursor

## Troubleshooting

### Theme Not Appearing
- Ensure the `.vsix` file was installed correctly
- Check that the theme file path in `package.json` is correct
- Restart Cursor IDE after installation

### Colors Not Applying
- Verify the theme is selected in Color Theme preferences
- Check that semantic highlighting is enabled
- Ensure the color theme file is properly formatted

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Use `npm run build:dev` to create a new package
- Check for syntax errors in the theme JSON file

## Next Steps

1. **Test thoroughly** in Cursor IDE
2. **Gather feedback** from users
3. **Iterate and improve** based on feedback
4. **Consider publishing** to VS Code marketplace for wider distribution
5. **Maintain and update** the theme as Cursor IDE evolves

## Support

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Keep README and CHANGELOG updated
- **Community**: Engage with Cursor IDE users for feedback
