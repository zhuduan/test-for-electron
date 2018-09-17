import { SysModule } from './sys.module';

describe('SysModule', () => {
  let sysModule: SysModule;

  beforeEach(() => {
    sysModule = new SysModule();
  });

  it('should create an instance', () => {
    expect(sysModule).toBeTruthy();
  });
});
