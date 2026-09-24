import type { ComponentType, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  ArrowTopRightIcon,
  EnvelopeClosedIcon,
  GlobeIcon,
  MobileIcon,
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

type FooterProps = {
  className?: string;
};

const WEBSITE_URL = 'https://example.com';
const PHONE_DISPLAY = '+1 555 0100';
const PHONE_HREF = 'tel:+15550100';
const EMAIL = 'info@example.com';

type ContactLinkProps = {
  href: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  children: ReactNode;
  external?: boolean;
};

function ContactLink({
  href,
  icon: Icon,
  children,
  external = false,
}: Readonly<ContactLinkProps>) {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group -mx-1.5 inline-flex min-h-6 items-center gap-2 rounded-md px-1.5 py-1 text-sm text-(--color-table-text) underline-offset-4 transition-colors outline-none hover:text-(--color-brand) hover:underline focus-visible:ring-2 focus-visible:ring-(--color-brand) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
    >
      <Icon
        aria-hidden
        className="size-4 shrink-0 text-(--color-modal-label) transition-colors group-hover:text-(--color-brand)"
      />
      <span className="break-all sm:break-normal">{children}</span>
      {external && (
        <>
          <ArrowTopRightIcon aria-hidden className="size-3.5 shrink-0" />
          <span className="sr-only">{t('layout.footer.opensInNewTab')}</span>
        </>
      )}
    </a>
  );
}

/**
 * Site footer for the authenticated shell. It shares the page column's
 * width and gutters so its content lines up with the page above it.
 */
export const Footer: React.FC<FooterProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <footer
      className={twMerge(
        'border-t border-(--color-border) bg-(--color-bg)',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 lg:px-10">
        <div className="flex flex-col gap-0.5 text-sm">
          <p className="font-medium text-(--color-table-text)">
            {t('layout.footer.copyright')}
          </p>
          <p className="text-(--color-modal-label)">
            {t('layout.footer.partOfThe')}{' '}
            <span className="font-medium text-(--color-table-text)">
              {t('layout.footer.groupName')}
            </span>
          </p>
        </div>

        <nav aria-label={t('layout.footer.contactLabel')}>
          <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <li>
              <ContactLink href={WEBSITE_URL} icon={GlobeIcon} external>
                {t('layout.footer.websiteLinkLabel')}
              </ContactLink>
            </li>
            <li>
              <ContactLink href={PHONE_HREF} icon={MobileIcon}>
                {PHONE_DISPLAY}
              </ContactLink>
            </li>
            <li>
              <ContactLink href={`mailto:${EMAIL}`} icon={EnvelopeClosedIcon}>
                {EMAIL}
              </ContactLink>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
