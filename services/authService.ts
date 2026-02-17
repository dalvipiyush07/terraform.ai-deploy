const API_URL = import.meta.env.VITE_API_URL || 'https://terraa.online/api';

export const authService = {
  async saveProject(title: string, files: any, messages: any) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, files, messages })
    });
    if (!res.ok) {
      const error = await res.json();
      throw { response: { status: res.status, data: error } };
    }
    return res.json();
  },

  async getProjects() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async updateProject(id: number, title: string, files: any, messages: any) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, files, messages })
    });
    return res.json();
  },

  async deleteProject(id: number) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async toggleFavorite(id: number, isFavorite: boolean) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/projects/${id}/favorite`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ is_favorite: isFavorite })
    });
    return res.json();
  },

  async updateTheme(theme: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/user/theme`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ theme })
    });
    return res.json();
  },

  async getUser() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async upgradePlan(plan: 'MONTHLY' | 'SIXMONTHS' | 'YEARLY') {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/user/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });
    return res.json();
  }
};
