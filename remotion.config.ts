import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// High quality H.264 output
Config.setCodec("h264");
Config.setCrf(18);
