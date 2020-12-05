import path from "path";

const bin = path.join(__dirname, "..", "..", "bin");

const getEnginePath = (): string => {
  const platformHandler: Record<string, string | undefined> = {
    darwin: path.join(bin, "darwin"),
    linux: path.join(bin, "linux"),
    win32: path.join(bin, "win32.exe"),
  };

  const engine = platformHandler[process.platform];
  if (!engine) {
    throw new Error(process.platform + " nescitus/Rodent_III binary not found");
  }

  return engine;
};

export default getEnginePath;
