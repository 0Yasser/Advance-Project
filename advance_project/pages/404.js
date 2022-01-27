import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(5);
  
  useEffect(() => {
    setInterval (()=>{
        setCounter(counter--);
    },1000)
    setTimeout(() => {
      router.push("/");
    }, 5500);
  }, []);


  return (
    <div className="not-found">
      <h1>Oops...</h1>
      <h2>ERROR 404: That page cannot be found :(</h2>
      <p>
        Going back to the{" "}
        <Link href="/">
          <a>Homepage</a>
        </Link>{" "}
        is {counter} seconds...
      </p>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default NotFound;