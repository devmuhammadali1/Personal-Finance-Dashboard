document.addEventListener('DOMContentLoaded', function() {
    const BREAKPOINT = 1000; // Your specific width restriction
    
    function applyBootstrapGrid() {
      const main = document.querySelector('main');
      if (!main) return;
      
      // Only transform if below breakpoint AND not already transformed
      if (window.innerWidth <= BREAKPOINT && !main.classList.contains('bs-enabled')) {
        // Mark as transformed
        main.classList.add('bs-enabled');
        
        // Add container class
        main.classList.add('container');
        
        // Create and insert the row wrapper
        const row = document.createElement('div');
        row.className = 'row g-3';
        
        // Move all child sections into the row
        while (main.firstChild) {
          row.appendChild(main.firstChild);
        }
        main.appendChild(row);
        
        // Apply column classes
        const sections = main.querySelectorAll('section');
        if (sections.length >= 3) {
          sections[0].classList.add('col-12', 'col-lg-4');  // Form section
          sections[1].classList.add('col-12', 'col-lg-5');  // Transaction history
          sections[2].classList.add('col-12', 'col-lg-3');  // Summary section
        }
        
        // Load Bootstrap grid CSS dynamically
        if (!document.getElementById('bs-grid-css')) {
          const link = document.createElement('link');
          link.id = 'bs-grid-css';
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap-grid.min.css';
          document.head.appendChild(link);
        }
      }
    }
    
    function revertOriginalLayout() {
      const main = document.querySelector('main.dashboard.bs-enabled');
      if (!main) return;
      
      if (window.innerWidth > BREAKPOINT) {
        // Remove the transformation marker
        main.classList.remove('bs-enabled');
        
        // Remove container class
        main.classList.remove('container');
        
        // Remove the row wrapper
        const row = main.querySelector('.row');
        if (row) {
          // Move all children back to main
          while (row.firstChild) {
            main.appendChild(row.firstChild);
          }
          row.remove();
        }
        
        // Remove column classes
        document.querySelector('.form-section')?.classList.remove('col-12', 'col-lg-4');
        document.querySelector('.form-section')?.nextElementSibling?.classList.remove('col-12', 'col-lg-5');
        document.querySelector('.datasec')?.classList.remove('col-12', 'col-lg-3');
        
        // Remove Bootstrap CSS
        const bsCSS = document.getElementById('bs-grid-css');
        if (bsCSS) bsCSS.remove();
      }
    }
    
    function handleResize() {
      applyBootstrapGrid();
      revertOriginalLayout();
    }
    
    // Initialize
    handleResize();
    
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    });
  });