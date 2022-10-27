import { Step, StepLabel, Stepper as StepperMui } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  activeStep: 1 | 2 | 3;
};

export const Stepper = (props: Props) => {
  const { t } = useTranslation();

  const steps = [t('enterEmail'), t('completeDetails'), t('success')];

  return (
    <StepperMui activeStep={props.activeStep - 1} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </StepperMui>
  );
};
