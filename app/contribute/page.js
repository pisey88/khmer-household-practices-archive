'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function ContributePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    khmer_title: '',
    category: 'Cooking',
    description: '',
    province: 'Kampong Speu',
    contributor_name: '',
  });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          setErrorMsg('Supabase environment variables are missing in .env.local');
          return;
        }

        const supabase = createBrowserClient(url, key);
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      }
    }
    checkAuth();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size must be less than 5 MB.');
        return;
      }
      setPhotoFile(file);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!e.currentTarget.reportValidity()) {
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabase = createBrowserClient(url, key);

      const activeUser = user;

      let photo_url = null;

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${activeUser.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, photoFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        photo_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('entries').insert([
        {
          title: formData.title.trim(),
          khmer_title: formData.khmer_title.trim(),
          category: formData.category,
          province: formData.province.trim(),
          description: formData.description.trim(),
          contributor_name: formData.contributor_name.trim(),
          photo_url,
          owner: activeUser.id,
        },
      ]);

      if (insertError) throw insertError;

      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'An error occurred while saving your entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contribute-page">
      <div className="contribute-page__inner">
        <header className="contribute-page__header">
          <p className="contribute-page__eyebrow">Community collection</p>
          <h1>Submit a Traditional Practice</h1>
          <p className="contribute-page__description">
            Document household tools, practices, and memories to help keep Khmer
            household knowledge alive.
          </p>
        </header>

        <section className="contribute-card">
          <div className="contribute-card__header">
            <div>
              <h2>Practice details</h2>
              <p>Share what you know about the practice and the story behind it.</p>
            </div>
          </div>

          {errorMsg && (
            <div className="contribute-error" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contribute-form" noValidate>
            <div className="contribute-form__grid">
                <div className="contribute-field">
                  <label htmlFor="title">Title (English)</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="e.g., Clay Kerosene Lamp"
                  />
                </div>

                <div className="contribute-field">
                  <label htmlFor="khmer_title">Title (Khmer)</label>
                  <input
                    id="khmer_title"
                    type="text"
                    name="khmer_title"
                    value={formData.khmer_title}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder="e.g., ចង្កៀងប្រេងកាត"
                  />
                </div>

                <div className="contribute-field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Cooking">Cooking</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Crafts">Crafts</option>
                  </select>
                </div>

                <div className="contribute-field">
                  <label htmlFor="province">Province</label>
                  <input
                    id="province"
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Kampong Speu"
                  />
                </div>

                <div className="contribute-field contribute-field--wide">
                  <label htmlFor="contributor_name">Contributor Name</label>
                  <input
                    id="contributor_name"
                    type="text"
                    name="contributor_name"
                    value={formData.contributor_name}
                    onChange={handleChange}
                    placeholder="Your name or relative's name"
                  />
                </div>

                <div className="contribute-field contribute-field--wide">
                  <label htmlFor="description">Description / Story</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={10}
                    maxLength={2000}
                    placeholder="Describe how it was used..."
                  />
                </div>

                <div className="contribute-field contribute-field--wide">
                  <label htmlFor="photo">Photo Upload</label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    required
                  />
                  <span className="contribute-field__hint">
                    JPEG, PNG, or WebP. Maximum file size: 5 MB.
                  </span>
                </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="contribute-submit"
            >
              {submitting ? 'Submitting...' : 'Submit Entry'}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>
      </div>

      {showAuthModal && (
        <div
          className="contribute-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowAuthModal(false);
          }}
        >
          <section
            className="contribute-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contribute-modal-title"
          >
            <button
              type="button"
              className="contribute-modal__close"
              aria-label="Close sign-in dialog"
              onClick={() => setShowAuthModal(false)}
            >
              ×
            </button>
            <p className="contribute-page__eyebrow">One more step</p>
            <h2 id="contribute-modal-title">Sign in to contribute</h2>
            <p>
              Your story is ready. Sign in or create an account to submit it to
              the archive.
            </p>
            <a
              href="/login"
              className="landing-button landing-button--primary contribute-modal__action"
            >
              Sign In / Sign Up
            </a>
          </section>
        </div>
      )}
    </main>
  );
}