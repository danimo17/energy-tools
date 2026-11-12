import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  it('rejects the previous confirmation when a new one replaces it', () => {
    const service = new ConfirmService();
    const answers: boolean[] = [];
    service.confirm().subscribe(answer => answers.push(answer));
    service.confirm().subscribe();
    expect(answers).toEqual([false]);
  });
});
