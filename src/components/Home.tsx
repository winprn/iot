import { MQTT_CLIENT, resend, SUPABASE_CLIENT } from '@/lib/utils';
import { Button, ButtonBase, Slider, Switch } from '@mui/material';
import { Blend, MoveLeft, MoveRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const LIGHTS = [
  {
    name: 'Kitchen',
    brightness: 2,
    on: true,
  },
  {
    name: 'Living room',
    brightness: 1,
    on: true,
  },
  {
    name: 'Bedroom 1',
    brightness: 3,
    on: true,
  },
];

const BRIGHTNESS_MAP = ['64', '128', '255'];

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [lights, setLights] = useState(
    JSON.parse(localStorage.getItem('lights') || 'null') || LIGHTS
  );
  const [motionValue, setMotionValue] = useState(
    JSON.parse(localStorage.getItem('motionValue') || `{"state": "OFF"}`).state
  );

  const updateLights = (index: number, value: string) => {
    setLights((prev) =>
      prev.map((l, i) => (i === index ? { ...l, on: value === 'ON' } : l))
    );
  };

  const scrollContainerRef = useRef(null);
  if (!localStorage.getItem('lights')) {
    localStorage.setItem('lights', JSON.stringify(LIGHTS));
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth', // Adds smooth motion to the scroll
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth', // Adds smooth motion to the scroll
      });
    }
  };

  useEffect(() => {
    localStorage.setItem('lights', JSON.stringify(lights));
  }, [lights]);

  useEffect(() => {
    MQTT_CLIENT.on('message', (topic, message) => {
      console.log(topic, message.toString());

      switch (topic) {
        case '/062222/RELAY1_SEND':
          updateLights(0, message.toString());
          break;
        case '/062222/RELAY2_SEND':
          updateLights(1, message.toString());
          break;
        case '/062222/RELAY3_SEND':
          updateLights(2, message.toString());
          break;
        case '/062222/NOTIFICATIONS':
          resend.emails.send({
            from: 'onboarding@resend.com',
            to: user.email,
            subject: 'Smart light notification',
            html: `Dear user, here is a notification from your smart lights: ${message.toString()}`,
          });
          break;
        default:
          break;
      }
    });

    return () => {
      MQTT_CLIENT.removeAllListeners();
    };
  }, [user.email]);

  useEffect(() => {
    localStorage.setItem('motionValue', JSON.stringify({ state: motionValue }));
  }, [motionValue]);

  return (
    <section className='p-8 flex flex-col gap-10 grow max-w-[60%] items-start h-[80%]'>
      <div>
        <h3 className='text-[#2B2B2B] text-2xl mb-4'>Sensor</h3>
        <div className='flex gap-8'>
          <div className='p-4 rounded-xl w-40 flex flex-col gap-2 items-start bg-[#D2E9FF]'>
            <div className='flex justify-between items-center w-full'>
              <p>{motionValue}</p>
              <Switch
                value={0}
                onClick={() => {
                  setMotionValue(motionValue === 'ON' ? 'OFF' : 'ON');
                  MQTT_CLIENT.publishAsync(
                    '/062222/PIR',
                    motionValue === 'ON' ? 'OFF' : 'ON'
                  );
                }}
              />
            </div>
            <ButtonBase className='!p-3 !bg-[#3E7EF7] !rounded-xl !text-white'>
              <Blend />
            </ButtonBase>
            <p>Motion sensor</p>
          </div>
          <div className='p-4 rounded-xl w-40 flex flex-col gap-2 items-start justify-center bg-[#D2E9FF]'>
            <div className='mt-auto text-3xl'>
              {lights.filter((light) => light.on).length}/{lights.length}
            </div>
            <p className='mt-auto'>Lights in use</p>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <h3 className='text-[#2B2B2B] text-2xl mb-4'>Lights</h3>
          <div>
            <Button onClick={handleScrollLeft}>
              <MoveLeft />
            </Button>
            <Button onClick={handleScrollRight}>
              <MoveRight />
            </Button>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className='flex gap-8 overflow-scroll w-full flex-nowrap'
          style={{
            scrollbarWidth: 'none',
          }}
        >
          {lights.map((light, index) => (
            <div
              key={light.name}
              className='p-4 rounded-xl min-w-44 flex flex-col gap-2 items-start bg-[#D2E9FF]'
            >
              <div className='flex justify-between items-center w-full'>
                <p>{light.on ? 'On' : 'Off'}</p>
                <Switch
                  checked={light.on}
                  onClick={() => {
                    setLights((prev) =>
                      prev.map((l) =>
                        l.name === light.name ? { ...l, on: !l.on } : l
                      )
                    );

                    MQTT_CLIENT.publishAsync(
                      `/062222/RELAY${index + 1}`,
                      light.on ? 'OFF' : 'ON'
                    );
                  }}
                />
              </div>
              <div className='flex flex-col gap-4 w-full'>
                <p>Brightness</p>
                <Slider
                  step={1}
                  min={1}
                  max={3}
                  onChange={(e, v) => {
                    setLights((prev) =>
                      prev.map((l) =>
                        l.name === light.name ? { ...l, brightness: v } : l
                      )
                    );

                    MQTT_CLIENT.publishAsync(
                      `/062222/LED${index + 1}`,
                      BRIGHTNESS_MAP[(v as number) - 1]
                    );
                  }}
                />
              </div>
              <p className='mt-auto'>{light.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
