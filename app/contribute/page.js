'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '../../components/common/LanguageProvider.js';
import { CAMBODIAN_PROVINCES } from '../../lib/provinces.js';
import { CATEGORIES } from '../../lib/constants.js';
import DescriptionLengthFeedback from '../../components/common/DescriptionLengthFeedback.js';
import {
  getTrimmedDescriptionLength,
  MIN_DESCRIPTION_LENGTH,
} from '../../lib/description.js';

export default function ContributePage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    khmer_title: '',
    category: 'Cooking',
    description: '',
    description_km: '',
    province: 'Kampong Speu',
    contributor_name: '',
    contributor_name_km: '',
  });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          setErrorMsg('contributeAuthNotConfigured');
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const resolvedError =
      (errorMsg === 'entryTitleRequired' && name === 'title' && value.trim()) ||
      (errorMsg === 'englishDescriptionTooShort' &&
        name === 'description' &&
        getTrimmedDescriptionLength(value) >= MIN_DESCRIPTION_LENGTH) ||
      (errorMsg === 'khmerDescriptionTooShort' &&
        name === 'description_km' &&
        getTrimmedDescriptionLength(value) >= MIN_DESCRIPTION_LENGTH) ||
      (errorMsg === 'entryProvinceRequired' && name === 'province' && value.trim());
    if (resolvedError) {
      setErrorMsg('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setPhotoFile(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoFile(null);
      e.target.value = '';
      setErrorMsg('contributeImageInvalidType');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoFile(null);
      e.target.value = '';
      setErrorMsg('contributeImageTooLarge');
      return;
    }
    setPhotoFile(file);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationError = '';
    if (!formData.title.trim()) {
      validationError = 'entryTitleRequired';
    } else if (
      getTrimmedDescriptionLength(formData.description) < MIN_DESCRIPTION_LENGTH
    ) {
      validationError = 'englishDescriptionTooShort';
    } else if (
      getTrimmedDescriptionLength(formData.description_km) < MIN_DESCRIPTION_LENGTH
    ) {
      validationError = 'khmerDescriptionTooShort';
    } else if (!formData.province.trim()) {
      validationError = 'entryProvinceRequired';
    } else if (!photoFile) {
      validationError = 'missingPhoto';
    }

    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    if (!user) {
      setShowAuthModal(true);
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
          province: formData.province,
          description: formData.description.trim(),
          description_km: formData.description_km.trim() || null,
          contributor_name: formData.contributor_name.trim(),
          contributor_name_km: formData.contributor_name_km.trim(),
          photo_url,
          owner: activeUser.id,
        },
      ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'contributeSubmissionError');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contribute-page">
      <div className="contribute-page__inner">
        <header className="contribute-page__header">
          <p className="contribute-page__eyebrow">{t('contributeEyebrow')}</p>
          <h1>{t('contributeTitle')}</h1>
          <p className="contribute-page__description">
            {t('contributeDescription')}
          </p>
        </header>

        {submitted ? (
          <section className="contribute-card contribute-card--success">
            <div className="contribute-card__header">
              <div>
                <h2>{t('contributeSuccessHeading')}</h2>
              </div>
            </div>
            <p className="contribute-success__message">{t('contributeSuccessMessage')}</p>
            <div className="contribute-success__actions">
              <a href="/my-entries" className="landing-button landing-button--primary">
                {t('contributeSuccessAction')} <span aria-hidden="true">&rarr;</span>
              </a>
              <a href="/" className="landing-button landing-button--secondary">
                {t('navHome')}
              </a>
            </div>
          </section>
        ) : (
          <section className="contribute-card">
          <div className="contribute-card__header">
            <div>
              <h2>{t('contributeDetailsHeading')}</h2>
              <p>{t('contributeDetailsDescription')}</p>
            </div>
          </div>

          {errorMsg && (
            <div className="contribute-error" role="alert">
              {t(errorMsg)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contribute-form" noValidate>
            <div className="contribute-form__grid">
                <div className="contribute-field">
                  <label htmlFor="title">{t('contributeTitleEnglish')}</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder={t('contributePlaceholderTitle')}
                  />
                </div>

                <div className="contribute-field">
                  <label htmlFor="khmer_title">{t('contributeTitleKhmer')}</label>
                  <input
                    id="khmer_title"
                    type="text"
                    name="khmer_title"
                    value={formData.khmer_title}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t('contributePlaceholderKhmerTitle')}
                  />
                </div>

                <div className="contribute-field">
                  <label htmlFor="category">{t('contributeCategory')}</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((category) => {
                      const key = `contributeCategory${category.replace(/\s/g, '')}`;
                      const translation = t(key);

                      return (
                        <option key={category} value={category}>
                          {translation === key ? category : translation}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="contribute-field">
                  <label htmlFor="province">{t('contributeProvince')}</label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  >
                    {CAMBODIAN_PROVINCES.map((province) => (
                      <option key={province.en} value={province.en}>
                        {language === "en" ? province.en : province.km}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contribute-field">
                  <label htmlFor="contributor_name">{t('contributeNameEnglish')}</label>
                  <input
                    id="contributor_name"
                    type="text"
                    name="contributor_name"
                    value={formData.contributor_name}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t('contributePlaceholderNameEnglish')}
                  />
                </div>

                <div className="contribute-field">
                  <label htmlFor="contributor_name_km">{t('contributeNameKhmer')}</label>
                  <input
                    id="contributor_name_km"
                    type="text"
                    name="contributor_name_km"
                    lang="km"
                    value={formData.contributor_name_km}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t('contributePlaceholderNameKhmer')}
                  />
                </div>

                <div className="contribute-field contribute-field--wide contribute-descriptions">
                  <div className="contribute-descriptions__grid">
                    <div className="contribute-field">
                      <label htmlFor="description">{t('contributeDescriptionEnglish')}</label>
                      <textarea
                        id="description"
                        name="description"
                        lang="en"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        minLength={MIN_DESCRIPTION_LENGTH}
                        maxLength={2000}
                        placeholder={t('contributePlaceholderDescription')}
                      />
                      <DescriptionLengthFeedback value={formData.description} language="en" />
                    </div>
                    <div className="contribute-field">
                      <label htmlFor="description_km">{t('contributeDescriptionKhmer')}</label>
                      <textarea
                        id="description_km"
                        name="description_km"
                        lang="km"
                        rows={5}
                        value={formData.description_km}
                        onChange={handleChange}
                        required
                        minLength={MIN_DESCRIPTION_LENGTH}
                        maxLength={2000}
                        placeholder={t('contributePlaceholderDescriptionKhmer')}
                      />
                      <DescriptionLengthFeedback value={formData.description_km} language="km" />
                    </div>
                  </div>
                </div>

                <div className="contribute-field contribute-field--wide">
                  <label htmlFor="photo">{t('contributePhoto')}</label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    required
                  />
                  <span className="contribute-field__hint">
                    {t('contributePhotoHint')}
                  </span>
                </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="contribute-submit"
            >
              {submitting ? t('contributeSubmitting') : t('contributeSubmit')}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>
        )}
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
              aria-label={t('contributeCloseDialog')}
              onClick={() => setShowAuthModal(false)}
            >
              ×
            </button>
            <p className="contribute-page__eyebrow">{t('contributeOneMoreStep')}</p>
            <h2 id="contribute-modal-title">{t('contributeSignInHeading')}</h2>
            <p>
              {t('contributeSignInMessage')}
            </p>
            <a
              href="/login"
              className="landing-button landing-button--primary contribute-modal__action"
            >
              {t('contributeSignInAction')}
            </a>
          </section>
        </div>
      )}
    </main>
  );
}