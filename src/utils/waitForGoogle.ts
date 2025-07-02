export const waitForGoogleMaps = (): Promise<typeof google> => {
    
  return new Promise((resolve) => {
    if (window.google && window.google.maps) {
      resolve(window.google);
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          resolve(window.google);
        }
      }, 100);
    }
  });
};
