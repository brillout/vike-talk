export { BannerSlides }

import React from 'react'
import vikeLogo from '../vike.svg'
import bildde from './brands/bildde.svg'
import contra from './brands/contra.svg'
import dia from './brands/dia.svg'
import ecosia from './brands/ecosia.svg'
import namecom from './brands/namecom.svg'
import sliteapp from './brands/sliteapp.svg'
import spline from './brands/spline.webp'
import uspFreedom from './usps/usp-freedom.svg'
import uspStability from './usps/usp-stability.svg'
import uspLightningDx from './usps/usp-lightning-dx.svg'

const brands = [
  { name: 'Name.com', logo: namecom, scale: 0.54 },
  { name: 'Slite', logo: sliteapp, scale: 1.08 },
  { name: 'Contra', logo: contra, scale: 0.82 },
  { name: 'Spline', logo: spline, scale: 1.4 },
  { name: 'Ecosia', logo: ecosia, scale: 0.9 },
  { name: 'Bild.de', logo: bildde, scale: 1.3 },
  { name: 'Dia.es', logo: dia, scale: 1.3 },
]

const usps = [
  { icon: uspFreedom, name: 'Freedom', gradient: 'linear-gradient(135deg, #00955f, #00b0a5)' },
  { icon: uspStability, name: 'Stability', gradient: 'linear-gradient(135deg, #7F5AF0, #3B82F6)' },
  { icon: uspLightningDx, name: 'Lightning DX', gradient: 'linear-gradient(135deg, #fe9618, #febc18)', iconGap: 6 },
]

function BannerSlides() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
          padding: '0 40px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: -10 }}>
          <img src={vikeLogo} style={{ height: 96, objectFit: 'contain', marginTop: -4 }} />
          <span
            className="logo-font"
            style={{
              fontSize: 72,
              fontWeight: 450,
              color: '#444',
              lineHeight: '1.2em',
            }}
          >
            Vike
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 430,
            color: '#666',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.45,
            opacity: 0.9,
          }}
        >
          <span style={{ display: 'block' }}>Build mission-critical applications with</span>
          <span style={{ display: 'block' }}>stability and development freedom.</span>
          {/*
          <span style={{ display: 'block', fontWeight: 500 }}>
            Build applications with stability and development freedom.
          </span>
          */}
          {/*
          <span style={{ display: 'block' }}>
            Framework powering mission-critical applications with
          </span>
          <span style={{ display: 'block' }}>unmatched stability and development freedom.</span>
          */}
        </p>

        {/* USPs */}
        <div style={{ display: 'flex', gap: 62, alignItems: 'center', whiteSpace: 'nowrap', marginTop: 20 }}>
          {usps.map(({ icon, name, gradient, iconGap }) => (
            <div
              key={name}
              style={{ display: 'flex', alignItems: 'center', gap: iconGap ?? 12, fontSize: 42, fontWeight: 500 }}
            >
              <img src={icon} alt="" style={{ height: 50, width: 50, objectFit: 'contain' }} />
              <span
                style={{
                  background: gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 650,
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Brand logos */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px 64px',
            width: '100%',
            marginTop: 30,
          }}
        >
          {brands.map(({ name, logo, scale }) => (
            <img
              key={name}
              src={logo}
              alt={name}
              style={{
                height: `${1.2 * scale}em`,
                objectFit: 'contain',
                filter: 'grayscale(1)',
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
