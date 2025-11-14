// frontend/app/components/JuiceSliderItem.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './JuiceSliderItem.module.css';

interface JuiceSliderItemProps {
    id: number;
    name: string;
    imageSrc: string;
    bgColor: string; // Untuk latar belakang oval
}

export default function JuiceSliderItem({ id, name, imageSrc, bgColor }: JuiceSliderItemProps) {
    return (
        // Link mengarahkan ke halaman detail produk
        <Link href={`/flavours/${id}`} className={styles.itemLink}>
            <div className={styles.itemContainer}>
                
                {/* Visual Oval dengan background gradasi dari warna produk */}
                <div className={styles.imageWrapper} style={{ backgroundColor: bgColor }}>
                    <Image
                        src={imageSrc}
                        alt={name}
                        width={100}
                        height={100}
                        className={styles.juiceImage}
                    />
                </div>
                
                {/* Nama Produk */}
                <p className={styles.juiceName}>{name}</p>
            </div>
        </Link>
    );
}