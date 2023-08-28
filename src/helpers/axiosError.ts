export function enrichWithErrorDetail(err: any) {
  if (typeof err === 'string') {
    err = { error: err };
  }
  err.error = err.error ?? err?.response?.data ?? err.message;
  return err;
}
