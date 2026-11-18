import { InstagramIcon } from '@/components/ui/instagram-icon'
import { clinica } from '@/data/clinica'
import { telLink, trackWhatsApp, whatsappLink } from '@/lib/whatsapp'
import { Container } from '@/components/layout/Container'

const { nome, slogan, cnpj, endereco, telefone, whatsapp, instagram, logo, responsavelTecnico: rt } = clinica
const { labels } = clinica.ui
// @handle a partir da URL do Instagram (ex.: .../medicmaisbarramansa/ → @medicmaisbarramansa)
const instagramHandle = `@${instagram.replace(/\/+$/, '').split('/').pop() ?? ''}`

const heading = 'text-small font-medium text-surface/60'
const link = 'underline-offset-4 transition-colors hover:text-surface hover:underline'

/** Rodapé: CNPJ, responsável técnica + CRO (CFO), contato, Instagram, ano dinâmico. */
export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-ink pt-16 pb-28 text-surface/85 lg:pt-20">
      <Container>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-12">
          <div className="sm:col-span-2 md:col-span-3 xl:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-surface">
                <picture>
                  <source srcSet={logo.avif} type="image/avif" />
                  <source srcSet={logo.webp} type="image/webp" />
                  <img src={logo.src} alt="" width={logo.width} height={logo.height} loading="lazy" className="size-7" />
                </picture>
              </span>
              <span className="font-display text-lead leading-tight font-medium text-surface">{nome}</span>
            </div>
            <p className="mt-5 max-w-[26ch] font-display text-subtitle text-surface/90">{slogan}</p>
          </div>

          <div className="xl:col-span-3">
            <p className={heading}>{labels.endereco}</p>
            <address className="mt-3 not-italic">
              <a href={endereco.mapsLink} target="_blank" rel="noopener noreferrer" className={link}>
                {endereco.rua}
                <br />
                {endereco.bairro} · {endereco.cidade} · {endereco.uf}
                <br />
                {endereco.cep}
                <span className="sr-only"> {labels.novaAba}</span>
              </a>
            </address>
          </div>

          <div className="xl:col-span-2">
            <p className={heading}>{labels.telefone}</p>
            <ul className="mt-3 grid gap-1.5 tabular-nums">
              <li>
                <a href={telLink()} className={link}>
                  {telefone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsApp('footer')}
                  className={link}
                >
                  {labels.whatsapp}
                  <br />
                  <span className="whitespace-nowrap">{whatsapp}</span>
                  <span className="sr-only"> {labels.novaAba}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="xl:col-span-3">
            <p className={heading}>{labels.responsavelTecnica}</p>
            <p className="mt-3 text-surface">{rt.name}</p>
            <p>{rt.cro}</p>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className={`mt-6 inline-flex items-center gap-2 ${link}`}>
              <InstagramIcon className="size-4" />
              {instagramHandle}
              <span className="sr-only">
                {' '}
                {labels.instagram} {labels.novaAba}
              </span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-surface/15 pt-6 text-small text-surface/60 sm:flex-row sm:justify-between">
          <p>
            © {ano} {nome}. {labels.direitos}
          </p>
          <p className="tabular-nums">
            {labels.cnpj} {cnpj}
          </p>
        </div>
      </Container>
    </footer>
  )
}
