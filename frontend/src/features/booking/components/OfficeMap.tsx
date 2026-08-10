import * as React from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { Modal } from '../../../components/ui/Modal';
import { OfficeFloor1 } from '../../../assets/OfficeFloor1';
import { OfficeFloor2 } from '../../../assets/OfficeFloor2';

type FloorLevel = '1' | '2';

export const OfficeMap: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeFloor, setActiveFloor] = React.useState<FloorLevel>('1');

  const open = t('bookings.officeMap.title');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button variant="outline" onClick={openModal}>
        {open}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="lg"
        className="max-w-3xl"
        ariaLabel={t('bookings.officeMap.title')}
        title={
          <h2 className="text-xl font-bold text-(--color-ink)">
            {t('bookings.officeMap.title')}
          </h2>
        }
        headerRight={
          <div className="flex items-center gap-3">
            <div className="flex gap-1 rounded-lg border border-(--color-border) bg-(--color-surface) p-1">
              {(['1', '2'] as FloorLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setActiveFloor(level)}
                  className={[
                    'cursor-pointer rounded-md px-4 py-1.5 text-sm font-semibold transition-colors',
                    activeFloor === level
                      ? 'bg-(--color-table-surface) text-(--color-primaryblue) shadow-(--shadow-card)'
                      : 'text-(--color-modal-label) hover:text-(--color-text)',
                  ].join(' ')}
                >
                  {t('bookings.officeMap.floorTab', { floor: level })}
                </button>
              ))}
            </div>
            <IconButton
              onClick={closeModal}
              aria-label={t('bookings.officeMap.closeAria')}
            >
              <CloseIcon className="pointer-events-none" fontSize="small" />
            </IconButton>
          </div>
        }
        bodyClassName="p-4 sm:p-5"
      >
        {activeFloor === '1' ? <OfficeFloor1 /> : <OfficeFloor2 />}
      </Modal>
    </>
  );
};

export default OfficeMap;
