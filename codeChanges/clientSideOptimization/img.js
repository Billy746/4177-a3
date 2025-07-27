// Before: Static PNG images
/*
<img src="/images/product-hero.png" alt="Product" />
*/

// After: Responsive WebP with fallback
<picture>
  <source 
    srcSet="/images/product-hero-480w.webp 480w, 
            /images/product-hero-800w.webp 800w,
            /images/product-hero-1200w.webp 1200w" 
    type="image/webp" 
  />
  <source 
    srcSet="/images/product-hero-480w.jpg 480w,
            /images/product-hero-800w.jpg 800w, 
            /images/product-hero-1200w.jpg 1200w" 
    type="image/jpeg" 
  />
  <img 
    src="/images/product-hero-800w.jpg" 
    alt="Product" 
    loading="lazy"
    sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1200px"
  />
</picture>