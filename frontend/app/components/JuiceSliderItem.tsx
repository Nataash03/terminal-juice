import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './JuiceSliderItem.module.css';

interface JuiceSliderItemProps {
    id: number;
    name: string;
    imageSrc: string;
    bgColor: string; 
}

export default function JuiceSliderItem({ id, name, imageSrc, bgColor }: JuiceSliderItemProps) {
    return (
        <Link href={`/flavours/${id}`} className={styles.itemLink}>
            <div className={styles.itemContainer}>
                <div className={styles.imageWrapper} style={{ backgroundColor: bgColor }}>
                    <Image
                        src={imageSrc}
                        alt={name}
                        width={100}
                        height={100}
                        className={styles.juiceImage}
                    />
                </div>
                
                <p className={styles.juiceName}>{name}</p>
            </div>
        </Link>
    );
}