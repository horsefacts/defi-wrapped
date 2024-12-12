'use client';
import { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import classNames from 'classnames';
import { toPng } from 'html-to-image';
import { DisconnectIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, StarIcon } from '@/public/icons';
import useTruncateText from '@/hooks/useTruncateText';
import { DWClickAnimation } from '../UI';
import useSystemFunctions from '@/hooks/useSystemFunctions';

const Step6 = ({ onPrev, setShouldTransitionToSix }: StepProps) => {
  const [step, setSteps] = useState(0);
  const { truncatedText } = useTruncateText('0x1234567890123456789012345678901234567890', 5, 4);

  const {
    metricsState: { metrics },
  } = useSystemFunctions();

  const mostUsedProtocol = metrics?.protocolUsage.mostUsedProtocols[0];
  const usedCount = metrics?.protocolUsage.interactionCounts;
  const transactionCount = metrics?.transactionActivity.totalTransactions?.toLocaleString();
  const mostTradedPairs = metrics?.tradingMetrics?.mostSwappedPairs[0];
  const totalSwapped = metrics?.tradingMetrics?.totalSwapped?.toLocaleString();
  const earned = metrics?.lendingBorrowing?.interest.earned?.toLocaleString();
  const lent = metrics?.lendingBorrowing?.totalSupplied?.toLocaleString();

  const stepContainerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const canGoBack = step > 0;
  const canGoNext = step < 3;

  const prev = () => {
    if (canGoBack) {
      setSteps((prevStep) => {
        const newStep = prevStep - 1;
        scrollToStep(newStep);
        return newStep;
      });
    }
  };

  const next = () => {
    if (canGoNext) {
      setSteps((prevStep) => {
        const newStep = prevStep + 1;
        scrollToStep(newStep);
        return newStep;
      });
    }
  };

  const scrollToStep = (newStep: number) => {
    if (stepContainerRef.current) {
      const stepDiv = stepContainerRef.current.children[newStep] as HTMLElement;
      stepDiv.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  const handleScroll = () => {
    if (stepContainerRef.current) {
      const container = stepContainerRef.current;
      const children = Array.from(container.children);
      const scrollLeft = container.scrollLeft;

      const closestIndex = children.reduce(
        (closest, child, index) => {
          const element = child as HTMLElement;
          const childCenter = element.offsetLeft + element.offsetWidth / 2;
          const containerCenter = scrollLeft + container.offsetWidth / 2;
          const distance = Math.abs(containerCenter - childCenter);

          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Infinity }
      ).index;

      setSteps(closestIndex);
    }
  };

  useEffect(() => {
    const container = stepContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleShare = async () => {
    if (boxRef.current) {
      try {
        const dataUrl = await toPng(boxRef.current);
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const file = new File([blob], 'DeFiWrapped.png', { type: 'image/png' });

        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'DeFi Wrapped',
            text: 'Check out my DeFi stats!',
          });
        } else {
          alert('Sharing is not supported on this browser.');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to share image:', error);
        }
      }
    }
  };

  const steps = [
    <>
      <span>This year</span>

      <div className="px-6 h-[51px] rounded-[40px] bg-400 border-[3px] border-50 flex items-center justify-center relative">
        <span className="text-[25px] leading-[26.5px] font-medium text-50">{mostUsedProtocol}</span>

        <div className="absolute -top-2 -right-3 z-10">
          <StarIcon duration={5} fill="#FFFFFF" width={36} height={36} />
        </div>

        <div className="absolute -bottom-2 left-0 z-10">
          <StarIcon duration={7} fill="#FFFFFF" width={23} height={23} />
        </div>
      </div>

      <p className="text-center">
        was your most used <br /> protocol with over <span className="text-800">{usedCount?.toLocaleString()}</span> <br /> transactions.
      </p>
    </>,
    <>
      <span>You performed over</span>

      <div className="px-6 h-[51px] rounded-[40px] bg-450 border-[3px] border-50 flex items-center justify-center relative">
        <span className="text-[25px] leading-[26.5px] font-medium text-1000">{transactionCount}</span>

        <div className="absolute -top-2 -right-3 z-10">
          <StarIcon duration={5} fill="#FFFFFF" width={36} height={36} />
        </div>

        <div className="absolute -bottom-2 left-0 z-10">
          <StarIcon duration={7} fill="#FFFFFF" width={23} height={23} />
        </div>
      </div>

      <p className="text-center">
        transactions this year <br /> and spent <span className="text-300">${(500).toLocaleString()}</span> in gas <br /> fees. You saved
        <span className="text-300">${(350).toLocaleString()}</span> <br /> using <span className="text-300">{'Base'}</span>
      </p>
    </>,
    <>
      <p className="text-center">
        This year, your most <br /> traded pair was
      </p>

      <div className="px-6 h-[51px] rounded-[40px] bg-500 border-[3px] border-50 flex items-center justify-center relative">
        <span className="text-[25px] leading-[26.5px] font-medium text-50">{mostTradedPairs}</span>

        <div className="absolute -top-2 -right-3 z-10">
          <StarIcon duration={5} fill="#FFFFFF" width={36} height={36} />
        </div>

        <div className="absolute -bottom-2 left-0 z-10">
          <StarIcon duration={7} fill="#FFFFFF" width={23} height={23} />
        </div>
      </div>

      <p className="text-center">
        You bought and <br /> sold it <span className="text-300">{totalSwapped}</span> times
      </p>
    </>,
    <>
      <span>You earned over</span>

      <div className="px-6 h-[51px] rounded-[40px] bg-850 border-[3px] border-50 flex items-center justify-center relative">
        <span className="text-[25px] leading-[26.5px] font-medium text-50">${earned}</span>

        <div className="absolute -top-2 -right-3 z-10">
          <StarIcon duration={5} fill="#FFFFFF" width={36} height={36} />
        </div>

        <div className="absolute -bottom-2 left-0 z-10">
          <StarIcon duration={7} fill="#FFFFFF" width={23} height={23} />
        </div>
      </div>

      <p className="text-center">
        in interest while <br /> lending a total of <br /> <span className="text-600">${lent}.</span>
      </p>
    </>,
  ];

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (step === 0) onPrev?.();
    },
    trackMouse: true,
  });

  useEffect(() => {
    setShouldTransitionToSix?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div {...swipeHandlers} className="bg-background-250 h-screen max-h-screen overflow-hidden relative pt-8 flex flex-col">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-50 text-[14px] leading-[18.48px] font-medium transition-colors duration-500">DeFi Wrapped</h3>
          <div className="flex items-center justify-center gap-1">
            <div
              className={classNames(
                'px-[9px] h-[26px] bg-50 flex items-center justify-center rounded-[14px] text-550 text-[11px] leading-[13.64px] font-medium'
              )}
            >
              {truncatedText}
            </div>

            <DWClickAnimation onClick={() => {}}>
              <DisconnectIcon fill={'#1E293B'} />
            </DWClickAnimation>
          </div>
        </div>

        <div className="flex-1 pt-11 pb-24 flex flex-col gap-16 items-stretch justify-between">
          <div className="flex flex-col gap-5 items-center">
            <div className="h-[26px] px-5 rounded-full border border-black flex items-center justify-center">
              <span className="text-xs text-50 font-medium">Summary</span>
            </div>

            <div
              ref={stepContainerRef}
              className="flex gap-5 overflow-x-scroll snap-x snap-mandatory scrollbar-hide text-[25px] leading-[29.75px] font-medium text-50 w-full px-14"
            >
              {steps.map((step_, index) => (
                <div
                  key={index}
                  ref={index === step ? boxRef : null}
                  className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-900 bg-950 shadow-primary p-4 min-w-[310px] min-h-[273px] snap-center"
                >
                  {step_}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-[18px]">
              {[
                { icon: <ArrowLeftCircleIcon />, onClick: prev, disabled: !canGoBack },
                { icon: <ArrowRightCircleIcon />, onClick: next, disabled: !canGoNext },
              ].map(({ icon, onClick, disabled }, index) => (
                <DWClickAnimation
                  key={index}
                  onClick={onClick}
                  className={classNames('transition-all duration-500', {
                    'opacity-50 pointer-events-none': disabled,
                  })}
                >
                  {icon}
                </DWClickAnimation>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 px-4">
            <DWClickAnimation
              className="h-[66px] px-20 rounded-[33px] bg-300 border-[1.5px] border-50 flex items-center justify-center"
              onClick={handleShare}
            >
              <span className="text-[18px] leading-[23.76px] text-50 text-center font-bold">Share</span>
            </DWClickAnimation>

            <p className="text-150 text-xs font-medium text-center">
              Liquid is making DeFi as simple as browsing <br /> a social feed. Join the waitlist{' '}
              <a href="https://useliquid.xyz" target="_blank" className="underline underline-offset-2 text-600">
                here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step6;