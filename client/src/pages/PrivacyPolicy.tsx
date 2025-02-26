
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy for Compare AI</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What We Collect</h2>
        <h3 className="text-xl font-medium mb-2">Personal Information</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Account Details (email address, username, encrypted password)</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-2">Facial Data</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Photos (temporarily processed by Face++ API, not permanently stored)</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-2">Usage Data</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Match History (usernames, scores, timestamps, results)</li>
          <li>Leaderboard Data (wins, losses, ranking)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
        <ul className="list-disc ml-6">
          <li>To calculate beauty scores via Face++</li>
          <li>To display match history and leaderboard rankings</li>
          <li>To allow profile editing and account deletion</li>
          <li>To analyze anonymous usage trends</li>
          <li>To send account-related notifications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Storage & Security</h2>
        <ul className="list-disc ml-6">
          <li>Data is stored in Neon Database with encryption</li>
          <li>Photos are securely processed via Face++ API</li>
          <li>All API calls are authenticated and rate-limited</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
        <ul className="list-disc ml-6">
          <li>Delete your account and data anytime</li>
          <li>Access and correct your personal information</li>
          <li>Opt out of the platform</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
        <ul className="list-disc ml-6">
          <li>Face++ API for facial analysis</li>
          <li>Neon Database for data storage</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
        <p>We use session cookies for authentication. No tracking cookies or ads are used.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
        <p>Our platform is not designed for users under 13. We do not knowingly collect data from minors.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
        <p>Updates will be posted here with a new Last Updated date.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p>For questions, data requests, or concerns, please contact us.</p>
      </section>

      <footer className="text-sm text-gray-600">
        Last Updated: {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}
