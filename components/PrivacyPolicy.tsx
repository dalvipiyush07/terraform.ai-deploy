import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#c9d1d9] py-12 px-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Effective Date: January 1, 2025 | Last Updated: January 1, 2025</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              Welcome to Terra.ai ("Platform", "we", "us", or "our"). This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our AI-based infrastructure code generation platform.
            </p>
            <p className="text-slate-300 leading-relaxed mt-3">
              Terra.ai is an independent AI platform operated as a standalone service. We are not affiliated with, endorsed by, or connected to Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), OpenAI, or any other cloud provider or AI company. All trademarks mentioned on this platform belong to their respective owners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">1.1 Account Information</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Name and email address</li>
              <li>Username and password (encrypted)</li>
              <li>Profile information you choose to provide</li>
            </ul>
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">1.2 Usage Information</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Infrastructure code generated through the platform</li>
              <li>Project data and configurations</li>
              <li>Platform interaction logs and analytics</li>
              <li>Device information and IP addresses</li>
            </ul>
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">1.3 Payment Information</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Billing name and address</li>
              <li>Payment method details (processed securely by third-party payment processors)</li>
              <li>Transaction history</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">2. How We Use Information</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Service Delivery:</strong> Providing AI-generated infrastructure code and platform features</li>
              <li><strong>Account Management:</strong> Creating and maintaining user accounts</li>
              <li><strong>Payment Processing:</strong> Processing subscriptions and transactions</li>
              <li><strong>Platform Improvement:</strong> Analyzing usage patterns to enhance functionality</li>
              <li><strong>Communication:</strong> Sending service updates, security alerts, and support messages</li>
              <li><strong>Security:</strong> Detecting and preventing fraud, abuse, and security incidents</li>
              <li><strong>Legal Compliance:</strong> Meeting legal obligations and enforcing our terms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">3. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement reasonable technical and organizational measures to protect your data, including encryption of data in transit and at rest, secure authentication mechanisms, regular security assessments, access controls and monitoring, and secure server infrastructure.
            </p>
            <p className="text-slate-300 leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">4. Data Sharing and Disclosure</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              We do not sell your personal data. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Payment Processors:</strong> To process subscription payments</li>
              <li><strong>Service Providers:</strong> Third-party services that help us operate the platform</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you explicitly authorize us to share information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">5. User Rights</h2>
            <p className="text-slate-300 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain data processing activities</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-3">
              To exercise these rights, contact us at <a href="mailto:pm.terra.ai@gmail.com" className="text-blue-400 hover:underline">pm.terra.ai@gmail.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">6. AI-Generated Content Disclaimer</h2>
            <p className="text-slate-300 leading-relaxed">
              The infrastructure code generated by our AI system is provided "as-is" without warranties. Users are solely responsible for reviewing and validating all generated code, testing infrastructure before production deployment, ensuring compliance with security and regulatory requirements, and any consequences of deploying AI-generated infrastructure.
            </p>
            <p className="text-slate-300 leading-relaxed mt-3 font-semibold">
              We are not liable for issues arising from the use of AI-generated outputs.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">7. Independent Platform Notice</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              Terra.ai is an independent AI platform. We are not affiliated with, endorsed by, sponsored by, or connected to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Amazon, Amazon Web Services (AWS)</li>
              <li>Microsoft, Microsoft Azure</li>
              <li>Google, Google Cloud Platform (GCP)</li>
              <li>OpenAI, Anthropic, or any AI company</li>
              <li>HashiCorp, Terraform (the tool)</li>
              <li>Any cloud provider or infrastructure company</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-3">
              All product names, logos, and brands mentioned on this platform are trademarks of their respective owners. Use of these names does not imply endorsement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">8. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              For questions, concerns, or requests regarding this Privacy Policy or your data:
            </p>
            <div className="mt-3 text-slate-300">
              <p><strong>Email:</strong> <a href="mailto:pm.terra.ai@gmail.com" className="text-blue-400 hover:underline">pm.terra.ai@gmail.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:pm.terra.ai@gmail.com" className="text-blue-400 hover:underline">pm.terra.ai@gmail.com</a></p>
              <p><strong>Jurisdiction:</strong> This Privacy Policy is governed by the laws of India.</p>
            </div>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-[#30363d] text-center">
          <p className="text-slate-500 text-sm">
            Terra.ai - Independent AI Platform | Empowering infrastructure automation through AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
