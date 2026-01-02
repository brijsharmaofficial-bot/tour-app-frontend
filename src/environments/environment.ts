export const environment = {
    production: false,
    firebaseConfig: {
      apiKey: "AIzaSyBZdtI4b3HnXfSEfAgsOWmEuFe9mV5eEUc",
      authDomain: "phone-auth-b77b1.firebaseapp.com",
      projectId: "phone-auth-b77b1",
      storageBucket: "phone-auth-b77b1.firebasestorage.app",
      messagingSenderId: "1004054579304",
      appId: "1:1004054579304:web:a9e374cfa3c553560b13dd",
      measurementId: "G-N5GBZ3DKLN"
    },
    // disableRecaptcha: true,

    apiUrl: 'http://localhost:8000/api', // Replace with your actual API URL

    msg91: {
      authKey: 'YOUR_MSG91_AUTH_KEY', // Get from MSG91 dashboard
      templateId: 'YOUR_TEMPLATE_ID', // Get from template section
      senderId: 'CARRNT', // Your approved sender ID (6 chars max)
      otpExpiry: 5, // minutes
      enabled: true // Set to true to use MSG91
    }
};