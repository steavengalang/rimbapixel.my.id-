# Modul Belajar React.js untuk Pemula

## Daftar Isi
1. [Pengenalan React](#pengenalan-react)
2. [Persiapan Environment](#persiapan-environment)
3. [Konsep Dasar React](#konsep-dasar-react)
4. [JSX (JavaScript XML)](#jsx-javascript-xml)
5. [Components](#components)
6. [Props](#props)
7. [State dan useState](#state-dan-usestate)
8. [Event Handling](#event-handling)
9. [Conditional Rendering](#conditional-rendering)
10. [Lists dan Keys](#lists-dan-keys)
11. [useEffect Hook](#useeffect-hook)
12. [Latihan Praktik](#latihan-praktik)

---

## 1. Pengenalan React

### Apa itu React?
React adalah library JavaScript yang dibuat oleh Facebook untuk membangun user interface (UI), terutama untuk aplikasi web. React memungkinkan kita membuat aplikasi web yang interaktif dan dinamis dengan mudah.

### Mengapa Belajar React?
- **Populer**: Digunakan oleh perusahaan besar seperti Facebook, Netflix, Uber
- **Component-Based**: Memecah UI menjadi komponen-komponen kecil yang dapat digunakan ulang
- **Virtual DOM**: Performa yang cepat
- **Ecosystem**: Banyak library pendukung
- **Job Market**: Banyak lowongan kerja React Developer

### Konsep Utama React
- **Components**: Blok bangunan aplikasi React
- **JSX**: Sintaks untuk menulis HTML di dalam JavaScript
- **Props**: Data yang dikirim antar komponen
- **State**: Data internal komponen yang bisa berubah
- **Hooks**: Fungsi khusus untuk mengelola state dan lifecycle

---

## 2. Persiapan Environment

### Yang Perlu Diinstall
1. **Node.js** (versi 14 atau lebih baru)
2. **npm** atau **yarn** (package manager)
3. **Code Editor** (VS Code recommended)

### Membuat Project React Baru
```bash
# Menggunakan Create React App
npx create-react-app my-first-react-app
cd my-first-react-app
npm start
```

### Struktur Folder Project
```
my-first-react-app/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── ...
├── package.json
└── ...
```

---

## 3. Konsep Dasar React

### Komponen Pertama
React menggunakan komponen sebagai blok bangunan utama. Setiap komponen adalah fungsi JavaScript yang mengembalikan JSX.

```javascript
// App.js
function App() {
  return (
    <div>
      <h1>Halo, ini adalah aplikasi React pertama saya!</h1>
    </div>
  );
}

export default App;
```

### Cara Kerja React
1. React membaca komponen
2. Mengubah JSX menjadi Virtual DOM
3. Membandingkan dengan DOM sebelumnya
4. Update hanya bagian yang berubah di DOM asli

---

## 4. JSX (JavaScript XML)

### Apa itu JSX?
JSX adalah ekstensi sintaks untuk JavaScript yang memungkinkan kita menulis HTML-like code di dalam JavaScript.

### Aturan JSX
```javascript
// ✅ Benar - Harus ada satu parent element
function MyComponent() {
  return (
    <div>
      <h1>Judul</h1>
      <p>Paragraf</p>
    </div>
  );
}

// ✅ Atau menggunakan Fragment
function MyComponent() {
  return (
    <>
      <h1>Judul</h1>
      <p>Paragraf</p>
    </>
  );
}

// ❌ Salah - Tidak boleh multiple parent elements
function MyComponent() {
  return (
    <h1>Judul</h1>
    <p>Paragraf</p>
  );
}
```

### JavaScript dalam JSX
```javascript
function Greeting() {
  const name = "Andi";
  const age = 25;
  
  return (
    <div>
      <h1>Halo, {name}!</h1>
      <p>Umur kamu {age} tahun</p>
      <p>Tahun depan kamu {age + 1} tahun</p>
    </div>
  );
}
```

### Perbedaan JSX dengan HTML
```javascript
// HTML menggunakan 'class', JSX menggunakan 'className'
<div className="container">

// HTML menggunakan 'for', JSX menggunakan 'htmlFor'  
<label htmlFor="email">

// Style dalam JSX menggunakan object
<div style={{backgroundColor: 'blue', fontSize: '16px'}}>
```

---

## 5. Components

### Functional Components
```javascript
// Komponen sederhana
function Welcome() {
  return <h1>Selamat datang!</h1>;
}

// Komponen dengan parameter
function Welcome(props) {
  return <h1>Selamat datang, {props.name}!</h1>;
}

// Arrow function version
const Welcome = (props) => {
  return <h1>Selamat datang, {props.name}!</h1>;
};
```

### Menggunakan Komponen
```javascript
function App() {
  return (
    <div>
      <Welcome />
      <Welcome name="Budi" />
      <Welcome name="Sari" />
    </div>
  );
}
```

### Nested Components
```javascript
function Header() {
  return (
    <header>
      <h1>Website Saya</h1>
      <Navigation />
    </header>
  );
}

function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <p>Konten utama</p>
      </main>
    </div>
  );
}
```

---

## 6. Props

### Apa itu Props?
Props (properties) adalah cara untuk mengirim data dari komponen parent ke komponen child. Props bersifat read-only (tidak bisa diubah oleh child component).

### Mengirim Props
```javascript
function App() {
  return (
    <div>
      <UserCard 
        name="Andi Wijaya"
        age={28}
        email="andi@email.com"
        isActive={true}
      />
    </div>
  );
}
```

### Menerima Props
```javascript
function UserCard(props) {
  return (
    <div className="user-card">
      <h2>{props.name}</h2>
      <p>Umur: {props.age}</p>
      <p>Email: {props.email}</p>
      <p>Status: {props.isActive ? 'Aktif' : 'Tidak Aktif'}</p>
    </div>
  );
}
```

### Destructuring Props
```javascript
// Cara yang lebih bersih
function UserCard({ name, age, email, isActive }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Umur: {age}</p>
      <p>Email: {email}</p>
      <p>Status: {isActive ? 'Aktif' : 'Tidak Aktif'}</p>
    </div>
  );
}
```

### Default Props
```javascript
function Button({ text, color = "blue", size = "medium" }) {
  return (
    <button 
      className={`btn btn-${color} btn-${size}`}
    >
      {text}
    </button>
  );
}

// Penggunaan
<Button text="Klik Saya" />
<Button text="Submit" color="green" size="large" />
```

---

## 7. State dan useState

### Apa itu State?
State adalah data internal komponen yang bisa berubah selama aplikasi berjalan. Ketika state berubah, komponen akan re-render.

### useState Hook
```javascript
import React, { useState } from 'react';

function Counter() {
  // [variableState, functionUntukMengubahState] = useState(nilaiAwal)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Anda sudah klik {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Tambah
      </button>
    </div>
  );
}
```

### Multiple State Variables
```javascript
function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
      />
      <input 
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
        placeholder="Umur"
      />
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      
      <div>
        <h3>Preview:</h3>
        <p>Nama: {name}</p>
        <p>Umur: {age}</p>
        <p>Email: {email}</p>
      </div>
    </div>
  );
}
```

### State dengan Object
```javascript
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    age: 0,
    email: ''
  });
  
  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,  // spread operator untuk copy object lama
      [field]: value  // update field yang spesifik
    }));
  };
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Nama"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
        placeholder="Umur"
      />
      <input 
        value={user.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Email"
      />
    </div>
  );
}
```

---

## 8. Event Handling

### onClick Event
```javascript
function ButtonExample() {
  const handleClick = () => {
    alert('Button diklik!');
  };
  
  const handleClickWithParameter = (message) => {
    alert(message);
  };
  
  return (
    <div>
      <button onClick={handleClick}>
        Klik Saya
      </button>
      
      <button onClick={() => handleClickWithParameter('Halo dari parameter!')}>
        Klik dengan Parameter
      </button>
    </div>
  );
}
```

### Form Events
```javascript
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah page refresh
    console.log('Username:', username);
    console.log('Password:', password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 9. Conditional Rendering

### If Statement
```javascript
function UserGreeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return <h1>Selamat datang kembali, {username}!</h1>;
  } else {
    return <h1>Silakan login terlebih dahulu.</h1>;
  }
}
```

### Ternary Operator
```javascript
function UserStatus({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Selamat datang, {username}!</h1>
      ) : (
        <h1>Silakan login</h1>
      )}
    </div>
  );
}
```

### Logical AND (&&)
```javascript
function Notification({ hasNewMessage, messageCount }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {hasNewMessage && (
        <div className="notification">
          Anda memiliki {messageCount} pesan baru!
        </div>
      )}
    </div>
  );
}
```

---

## 10. Lists dan Keys

### Rendering Lists
```javascript
function TodoList() {
  const todos = [
    { id: 1, text: 'Belajar React', completed: false },
    { id: 2, text: 'Membuat project', completed: true },
    { id: 3, text: 'Deploy aplikasi', completed: false }
  ];
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span style={{
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Mengapa Key Penting?
Key membantu React mengidentifikasi item mana yang berubah, ditambah, atau dihapus. Selalu gunakan ID unik sebagai key.

```javascript
// ✅ Benar - menggunakan ID unik
{items.map(item => <li key={item.id}>{item.name}</li>)}

// ❌ Salah - menggunakan index array
{items.map((item, index) => <li key={index}>{item.name}</li>)}
```

---

## 11. useEffect Hook

### Apa itu useEffect?
useEffect adalah hook untuk melakukan side effects seperti API calls, subscriptions, atau manual DOM manipulation.

### Basic useEffect
```javascript
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
    
    // Cleanup function
    return () => clearInterval(interval);
  }, []); // Empty dependency array = hanya jalankan sekali
  
  return <div>Timer: {seconds} detik</div>;
}
```

### useEffect dengan Dependencies
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Simulasi API call
    setTimeout(() => {
      setUser({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@email.com`
      });
      setLoading(false);
    }, 1000);
    
  }, [userId]); // Jalankan ulang ketika userId berubah
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## 12. Latihan Praktik

### Project 1: Todo App Sederhana
```javascript
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <h1>Todo App</h1>
      
      <div>
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tambah todo baru..."
        />
        <button onClick={addTodo}>Tambah</button>
      </div>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Hapus</button>
          </li>
        ))}
      </ul>
      
      <p>Total: {todos.length} | Selesai: {todos.filter(t => t.completed).length}</p>
    </div>
  );
}

export default TodoApp;
```

### Project 2: Simple Counter dengan Multiple Features
```javascript
import React, { useState, useEffect } from 'react';

function AdvancedCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  
  // Auto increment
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setCount(prevCount => prevCount + step);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, step]);
  
  const reset = () => {
    setCount(0);
    setIsRunning(false);
  };
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Advanced Counter</h1>
      <h2 style={{ fontSize: '3em' }}>{count}</h2>
      
      <div>
        <button onClick={() => setCount(count - step)}>-{step}</button>
        <button onClick={() => setCount(count + step)}>+{step}</button>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <label>
          Step: 
          <input 
            type="number"
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value) || 1)}
            style={{ width: '60px', margin: '0 10px' }}
          />
        </label>
      </div>
      
      <div>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Stop' : 'Start'} Auto
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      
      <p>
        Status: {isRunning ? 'Running' : 'Stopped'} | 
        Step: {step} | 
        Count: {count}
      </p>
    </div>
  );
}

export default AdvancedCounter;
```

---

## Tips untuk Pemula

### 1. Best Practices
- Gunakan nama komponen dengan PascalCase (ContohKomponen)
- Gunakan destructuring untuk props
- Pisahkan komponen ke file terpisah ketika sudah besar
- Gunakan key yang unik untuk list items
- Jangan lupa import React jika diperlukan

### 2. Common Mistakes
- Lupa menggunakan key dalam list
- Memodifikasi state secara langsung
- Tidak menggunakan useEffect dengan benar
- Lupa binding event handlers

### 3. Debugging Tips
- Gunakan React Developer Tools
- console.log untuk debug state
- Perhatikan error messages di console
- Gunakan strict mode dalam development

### 4. Next Steps
Setelah menguasai dasar-dasar ini, Anda bisa lanjut belajar:
- React Router (untuk navigasi)
- Context API (untuk state management)
- Custom Hooks
- Testing dengan Jest
- Styling dengan CSS Modules atau Styled Components
- State management dengan Redux atau Zustand

---

## Kesimpulan

React adalah tool yang powerful untuk membangun user interface modern. Dengan memahami konsep-konsep dasar seperti components, props, state, dan hooks, Anda sudah memiliki fondasi yang kuat untuk membangun aplikasi React yang kompleks.

Ingat: **Praktek adalah kunci!** Cobalah membuat project-project kecil untuk mengasah kemampuan React Anda.

Selamat belajar React! 🚀
