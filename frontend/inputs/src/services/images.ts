export async function add_images(data_form: FormData) {
    const res = await fetch(`/api/image`, {
      method: "POST",
      body: data_form,
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
    return null;
  }