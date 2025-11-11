import { useMemo, useState } from 'react';

const highlights = [
  {
    title: 'Discover Your Next Big Idea',
    description: 'Get curated business ideas and inspiration tailored to your interests.',
    icon: '💡',
  },
  {
    title: 'Learn from Experts',
    description: 'Access top business podcasts and online courses to sharpen your entrepreneurial skills.',
    icon: '🎓',
  },
  {
    title: 'Find Your Dream Cofounder',
    description: 'Connect with like-minded entrepreneurs and form winning teams.',
    icon: '🤝',
  },
  {
    title: 'Turn Ideas into Reality',
    description: 'Generate business plans and get step-by-step guidance on opening your company.',
    icon: '🚀',
  },
  {
    title: 'Grow and Fund Your Business',
    description: 'Network with others, join funding opportunities, and manage investments all in one place.',
    icon: '📈',
  },
];

const plans = [
  { label: '$5 – $10 / mois', value: '5-10' },
  { label: '$10 – $20 / mois', value: '10-20' },
  { label: '$20+ / mois', value: '20-plus' },
];

export default function App() {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    plan: '',
    platform: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const highlightCards = useMemo(
    () =>
      highlights.map((highlight, index) => (
        <article className={`highlight-card fade-up delay-${index + 1}`} key={highlight.title}>
          <div className="icon-wrapper" aria-hidden="true">
            {highlight.icon}
          </div>
          <h3>{highlight.title}</h3>
          <p>{highlight.description}</p>
        </article>
      )),
    []
  );

  return (
    <div className="page">
      <main>
        <section id="hero" className="hero fade-up">
          <span className="badge">Your all-in-one startup companion</span>
          <h1>Accelerate every step of your entrepreneurial journey</h1>
          <p>
          Exit the Matrix brings together ideas, experts, co-founders, and funding to turn your ambitions into a thriving business. Plan, launch, and grow your startup faster than ever before.
          </p>
          <div className="cta-buttons">
            <button
              type="button"
              className="cta-primary"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Discover the features
            </button>
          </div>
        </section>

        <section id="features" className="highlights">
          {highlightCards}
        </section>

        <section className="form-section">
          <div className="form-container fade-up delay-2">
            <h2>Join early access</h2>
            <p>
              Be among the first to test the platform, shape the product roadmap, and receive exclusive benefits when the official launch happens.
            </p>
            <form
              className="signup-form"
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitMessage(null);
                setSubmitError(null);

                if (!formData.email) {
                  setSubmitError('Please provide a valid email address.');
                  return;
                }

                try {
                  setIsSubmitting(true);
                  const response = await fetch('/api/join-early-access', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                  });

                  const contentType = response.headers.get('content-type') ?? '';
                  const isJson = contentType.includes('application/json');
                  const payload = isJson ? await response.json() : await response.text();
                  const result = isJson ? payload : { success: false, message: payload || null };

                  if (!response.ok || !result.success) {
                    throw new Error(
                      result.message ??
                        'Unable to save your request. Please try again or contact us if the issue persists.'
                    );
                  }

                  setSubmitMessage('Thanks! You are on the list. We will be in touch soon.');
                  setFormData({
                    email: '',
                    message: '',
                    plan: '',
                    platform: '',
                  });
                } catch (error) {
                  setSubmitError(error.message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <label htmlFor="email">
                Email *
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, email: event.target.value.trim() }))
                  }
                />
              </label>
              <label htmlFor="message">
                Message (optional)
                <textarea
                  id="message"
                  name="message"
                  className="textarea-field"
                  placeholder="Tell us what you're looking for in this platform..."
                  value={formData.message}
                  onChange={(event) => setFormData((previous) => ({ ...previous, message: event.target.value }))}
                />
              </label>
              <label htmlFor="platform">
                On which platform are you ?
                <select
                  id="platform"
                  name="platform"
                  className="select-field"
                  value={formData.platform}
                  onChange={(event) => setFormData((previous) => ({ ...previous, platform: event.target.value }))}
                >
                  <option value="" disabled>
                    Choose a platform
                  </option>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                </select>
              </label>
              <label htmlFor="plan">
                Monthly budget envisaged
                <select
                  id="plan"
                  name="plan"
                  className="select-field"
                  value={formData.plan}
                  onChange={(event) => setFormData((previous) => ({ ...previous, plan: event.target.value }))}
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {plans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </label>
              {submitMessage ? <p className="success-message">{submitMessage}</p> : null}
              {submitError ? <p className="error-message">{submitError}</p> : null}
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Join Early Access'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Exit the Matrix. All rights reserved.</footer>
    </div>
  );
}

