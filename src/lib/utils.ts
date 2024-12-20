import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";
import mqtt from "mqtt";
import { Resend } from "resend";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const OPEN_WEATHER_API_KEY = import.meta.env
	.VITE_OPEN_WEATHER_API_KEY as string;
export const THINKSPEAK_API_KEY = import.meta.env
	.VITE_THINKSPEAK_API_KEY as string;
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const SUPABASE_CLIENT = createClient(
	"https://exhrbvcxcykxgaukndcb.supabase.co",
	ANON_KEY,
);

export const MQTT_CLIENT = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", {
	clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
	protocol: "wss",
	connectTimeout: 30 * 1000,
});
export const resend = new Resend("re_aJjEAt6T_5ccf84fUwXgXHiwVdhGBZhL8");

export type Data = {
	date: Date;
	data: number;
};

export type Series = {
	label: string;
	data: Data[];
};
