import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MQTT_CLIENT } from '@/lib/utils';
import { Switch } from '@mui/material';
import { useState } from 'react';

const defaultState = {
  light: '1',
  notification: false,
  time: '1',
};

export default function SettingPage() {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem('state') || 'null') || defaultState
  );
  console.log(state);

  const handleClick = () => {
    localStorage.setItem('state', JSON.stringify(state));
    MQTT_CLIENT.publish('/062222/LIGHTNUM', state.light);
    MQTT_CLIENT.publish('/062222/MES', state.notification ? 'ON' : 'OFF');
    MQTT_CLIENT.publish('/062222/TIME', state.time);
  };

  return (
    <section className='grow h-[80%] p-8 bg-white rounded-xl'>
      <h3 className='text-3xl'>Status</h3>
      <div className='w-full'>
        <p>Motion sensor</p>
        <div className='w-full flex items-center gap-2'>
          <p>Light</p>
          <Select
            onValueChange={(val) =>
              setState((prev) => ({ ...prev, light: val }))
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='1' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Light</SelectLabel>
                <SelectItem value='0'>1</SelectItem>
                <SelectItem value='1'>2</SelectItem>
                <SelectItem value='2'>3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className='flex items-center gap-2'>
          <p>Notifications</p>
          <Switch
            checked={state.notification}
            onChange={(e, v) => {
              setState((prev) => ({ ...prev, notification: v }));
            }}
          />
        </div>
        <div>
          <p>Time: </p>
          <Select
            onValueChange={(val) =>
              setState((prev) => ({ ...prev, time: val }))
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={`${state.time} mins`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time</SelectLabel>
                <SelectItem value='1'>1 min</SelectItem>
                <SelectItem value='5'>5 mins</SelectItem>
                <SelectItem value='15'>15 mins</SelectItem>
                <SelectItem value='30'>30 mins</SelectItem>
                <SelectItem value='45'>45 mins</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className='bg-[#308BF3] hover:bg-[#308bf3d9] text-white mt-2'
        onClick={handleClick}
      >
        Save
      </Button>
    </section>
  );
}
