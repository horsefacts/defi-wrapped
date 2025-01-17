import Image from 'next/image';
import { motion } from 'framer-motion';

import useSystemFunctions from '@/hooks/useSystemFunctions';
import { slideInFromBottomToSettle, slideInFromTopToSettle } from '@/utils/helpers';
import Message from '@/assets/message';
import Plane from '@/assets/plane';

const Step4 = () => {
  const {
    appState: { windowInnerHeight },
  } = useSystemFunctions();
  return (
    <div
      className="h-full w-full flex flex-col items-center relative gap-10"
      style={{
        paddingTop: `${windowInnerHeight! * 0.3}px`,
      }}
    >
      <motion.h1 {...slideInFromTopToSettle} className="text-[55px] leading-[55px] text-center text-50 font-medium relative z-50">
        Transaction <br /> Highlights
      </motion.h1>

      <motion.div
        {...slideInFromBottomToSettle}
        transition={{ delay: 1 }}
        className="flex items-center justify-center relative gap-5 w-full"
      >
        <Message />
        <Plane />

        <div className="absolute -top-14">
          <Image src={'/images/colors.png'} alt="colors" width={500} height={383} className="object-cover w-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default Step4;
