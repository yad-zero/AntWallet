const githubUrl = 'https://raw.githubusercontent.com/username/repository-name/branch-name/data.json';
const cacheKey = 'githubDataCache';
const cacheTimeKey = 'githubDataCacheTime';
const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

let cachedData = localStorage.getItem(cacheKey);
let cachedTime = localStorage.getItem(cacheTimeKey);

const currentTime = new Date().getTime();

if (cachedData && currentTime - cachedTime < cacheExpiry) {
    // If the cached data is still fresh, use it
    console.log('Using cached data:', JSON.parse(cachedData));
} else {
    // Fetch from GitHub if the cache is expired or missing
    fetch(githubUrl)
        .then(response => response.json())
        .then(data => {
            // Cache the new data and timestamp
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, currentTime.toString());
            console.log('Fetched from GitHub:', data);
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
        });
}