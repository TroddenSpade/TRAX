import { Check, Download } from 'lucide-react'
import { usePwaInstall } from '../../hooks/usePwaInstall'
import { LogoMark } from '../Logo'

export default function InstallPanel({
  onNotify,
}: {
  onNotify: (message: string) => void
}) {
  const { canInstall, installed, isIos, install } = usePwaInstall()

  async function handleInstall() {
    if (installed) return

    if (!canInstall) {
      onNotify(
        isIos
          ? 'On iOS: tap Share, then Add to Home Screen.'
          : 'Open your browser menu and choose Install app.',
      )
      return
    }

    const accepted = await install()
    if (accepted) {
      onNotify('TRAX installed — see you on the home screen.')
    }
  }

  return (
    <section className="panel install-card" id="install">
      <div className="install-top">
        <LogoMark size={54} />
        <div>
          <h2>Take the desk with you.</h2>
          <p>
            Install TRAX as an app. Full-screen, offline-ready, and always one tap
            away.
          </p>
        </div>
      </div>

      <div className="install-badges">
        <span className="badge-ok">
          <Check size={12} /> PWA
        </span>
        <span className="badge-ok">
          <Check size={12} /> Offline shell
        </span>
      </div>

      <div className="install-actions">
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleInstall}
          disabled={installed}
        >
          {installed ? (
            <>
              <Check size={14} /> Installed
            </>
          ) : (
            <>
              <Download size={14} /> Install app
            </>
          )}
        </button>
        <span className="install-hint">
          {installed
            ? 'You are running the installed build.'
            : canInstall
              ? 'Ready to install on this device.'
              : isIos
                ? 'On iOS: Share → Add to Home Screen.'
                : 'Use your browser menu → Install app.'}
        </span>
      </div>
    </section>
  )
}
