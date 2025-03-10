
/**
 * Utility function to handle smooth scrolling to elements
 * @param elementId The ID of the element to scroll to
 */
export const scrollToElement = (elementId: string) => {
  if (elementId === 'hero-section') {
    // Special case for scrolling to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }
  
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
