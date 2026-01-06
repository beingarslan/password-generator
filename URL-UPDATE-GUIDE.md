# Quick Domain Update Guide

After you deploy your app, you need to replace all placeholder URLs with your actual domain. Here's a quick reference for all the places you need to update.

## Your Domain
**Replace**: `https://yourdomain.com/`  
**With**: `https://YOUR-ACTUAL-DOMAIN.com/`

---

## Files to Update

### 1. index.html (6 locations)

```html
<!-- Line ~15: Canonical URL -->
<link rel="canonical" href="https://YOUR-DOMAIN.com/" />

<!-- Line ~19: Open Graph URL -->
<meta property="og:url" content="https://YOUR-DOMAIN.com/" />

<!-- Line ~20: Open Graph Image -->
<meta property="og:image" content="https://YOUR-DOMAIN.com/og-image.png" />

<!-- Line ~26: Twitter Image -->
<meta name="twitter:image" content="https://YOUR-DOMAIN.com/twitter-image.png" />

<!-- Line ~39: JSON-LD WebApplication URL -->
"url": "https://YOUR-DOMAIN.com/"

<!-- Line ~57: JSON-LD FAQ (inside script tag) - No URL needed, but verify context -->
```

### 2. public/sitemap.xml (1 location)

```xml
<!-- Line ~5: Site URL -->
<loc>https://YOUR-DOMAIN.com/</loc>

<!-- Line ~6: Update lastmod date -->
<lastmod>2024-12-15</lastmod>  <!-- Use your deployment date -->
```

### 3. public/robots.txt (1 location)

```txt
<!-- Line ~4: Sitemap URL -->
Sitemap: https://YOUR-DOMAIN.com/sitemap.xml
```

---

## Search & Replace Commands

### Using VS Code:
1. Press `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)
2. Search for: `https://yourdomain.com/`
3. Replace with: `https://YOUR-ACTUAL-DOMAIN.com/`
4. Click "Replace All"

### Using Command Line:
```bash
# macOS/Linux
find . -type f \( -name "*.html" -o -name "*.xml" -o -name "*.txt" \) -not -path "*/node_modules/*" -exec sed -i '' 's|https://yourdomain.com/|https://YOUR-ACTUAL-DOMAIN.com/|g' {} +

# Linux (without '')
find . -type f \( -name "*.html" -o -name "*.xml" -o -name "*.txt" \) -not -path "*/node_modules/*" -exec sed -i 's|https://yourdomain.com/|https://YOUR-ACTUAL-DOMAIN.com/|g' {} +
```

---

## Verification Checklist

After replacing URLs:

- [ ] Check `index.html` - view in browser and inspect source
- [ ] Check `public/sitemap.xml` - open in browser: `yourdomain.com/sitemap.xml`
- [ ] Check `public/robots.txt` - open in browser: `yourdomain.com/robots.txt`
- [ ] Test Open Graph preview: https://developers.facebook.com/tools/debug/
- [ ] Test Twitter Card: https://cards-dev.twitter.com/validator

---

## Common Mistakes to Avoid

❌ **Don't include trailing slashes inconsistently**
- Bad: `https://yourdomain.com` (no slash) mixed with `https://yourdomain.com/` (with slash)
- Good: Use `https://yourdomain.com/` everywhere (with slash)

❌ **Don't forget the protocol**
- Bad: `yourdomain.com/`
- Good: `https://yourdomain.com/`

❌ **Don't use www inconsistently**
- Choose either `https://yourdomain.com/` OR `https://www.yourdomain.com/`
- Use the same format everywhere
- Set up 301 redirect from non-preferred to preferred version

✅ **Best Practice**: Use `https://yourdomain.com/` (HTTPS, no www, with trailing slash)

---

## After Updating

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run preview
   ```

3. **View page source** and verify URLs are correct

4. **Deploy to your hosting platform**

5. **Verify in production**:
   - Visit your site
   - Right-click → "View Page Source"
   - Search for your domain
   - Verify all URLs are correct

---

## Need More Help?

See the complete guides:
- [SEO-GUIDE.md](./SEO-GUIDE.md) - Full SEO documentation
- [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - Complete deployment steps
