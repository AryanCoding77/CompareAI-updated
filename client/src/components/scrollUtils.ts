
/**
 * Utility function to handle smooth scrolling to elements
 * @param elementId The ID of the element to scroll to
 */
export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
