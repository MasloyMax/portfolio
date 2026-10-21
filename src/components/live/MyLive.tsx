import { profile } from '../../profile'

export function MyLive() {
  return (
    <section className="profile-overview" id="about" aria-labelledby="about-title">
      <div className="profile-intro">
        <div className="eyebrow section-label">01 / ПРОФИЛЬ</div>
        <h2 id="about-title">Обо мне<span className="muted">.</span></h2>
        {profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {profile.availability && <p className="profile-availability">{profile.availability}</p>}
      </div>

      <dl className="profile-facts">
        {profile.location && (
          <div className="profile-location">
            <dt>Город</dt>
            <dd>{profile.location}</dd>
          </div>
        )}
        {profile.facts.map(fact => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {profile.education.length > 0 && (
        <div className="profile-education" role="group" aria-labelledby="education-title">
          <h3 id="education-title">Образование</h3>
          <ol>
            {profile.education.map(education => (
              <li key={education.institution + education.period}>
                <span className="education-year">{education.period}</span>
                <div>
                  <h4>{education.title}</h4>
                  <p>{education.institution}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {profile.languages.length > 0 && (
        <div className="profile-languages" role="group" aria-labelledby="languages-title">
          <h3 id="languages-title">Языки</h3>
          <ul>{profile.languages.map(language => <li key={language}>{language}</li>)}</ul>
        </div>
      )}
    </section>
  )
}
