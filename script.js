// DOM imports
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
// Fetch constants
const API_KEY = 'rMhFyVYci3vMmeE_GBTeQK-VaZbhjzAqZyXlwMJ5pqs';
const PHOTO_COUNT = 30;
const UNSPLASH_API_URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${PHOTO_COUNT}`;

// Helper function
function setAttributes(element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function nearPageBottom() {
  return window.scrollY + window.innerHeight >= document.body.offsetHeight - 500;
}

// Get photos from UNSPLASH API
async function getPhotos() {
  try {
    const response = await fetch(UNSPLASH_API_URL);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(error);
  }
}

// Display photos on browser
async function displayPhotos(photos, callback) {
  photos.forEach((photo, idx) => {
    // image link
    const link = document.createElement('a');
    setAttributes(link, {
      href: photo.links.html,
      target: '_blank',
    });
    // image element
    const image = document.createElement('img');
    setAttributes(image, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Add event listener to the last image element
    if (idx === photos.length - 1) {
      image.addEventListener('load', callback, { once: true });
    }
    // Append to DOM
    link.append(image);
    imageContainer.append(link);
  });
}

async function loadApplication() {
  const loadPhotos = (() => {
    let loading = false;

    return async () => {
      if (nearPageBottom() && !loading) {
        loading = true;
        // fetch photos and await result
        const photos = await getPhotos();
        // display the fetched phots and pass callback to reset 'loading' variable
        await displayPhotos(photos, () => {
          loading = false;
          loader.hidden = true;
        });
      }
    };
  })();
  await loadPhotos();
  window.addEventListener('scroll', loadPhotos);
}

// On app load
loadApplication();
