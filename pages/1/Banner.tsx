export { BannerSlides }

import React from 'react'
import { HeroTagline } from './HeroTagline'
import vikeLogo from './vike.svg'
function BannerSlides() {
  return (
    <BannerCommon
      taglineSecondary="Composable framework for building advanced applications with stability and flexibility."
      taglineSecondaryStyle={{ marginTop: -20 }}
      taglineStyle={{ marginTop: -20 }}
      style={{ background: 'white' }}
    />
  )
}

function BannerCommon({
  style,
  logo,
  logoText = 'Vike',
  logoScale = 1.3,
  logoStyle,
  logoTextStyle,
  taglineStyle,
  taglineSecondary,
  taglineSecondaryStyle,
}: {
  style?: React.CSSProperties
  logo?: boolean
  logoText?: string
  logoScale?: number
  logoStyle?: React.CSSProperties
  logoTextStyle?: React.CSSProperties
  taglineStyle?: React.CSSProperties
  taglineSecondary?: string
  taglineSecondaryStyle?: React.CSSProperties
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f0f0',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {logo !== false && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 25,
              marginLeft: -25,
            }}
          >
            <img
              src={vikeLogo}
              style={{
                height: 60 * logoScale,
                objectFit: 'contain',
                marginTop: -2,
                marginRight: 14,
                ...logoStyle,
              }}
            />
            <span
              className="logo-font"
              style={{
                fontSize: 45.6 * logoScale,
                fontWeight: 440,
                fontStyle: 'italic',
                color: '#707070',
                lineHeight: '1.2em',
                ...logoTextStyle,
              }}
            >
              {logoText}
            </span>
          </div>
        )}
        {logo !== true && (
          <HeroTagline
            style={{ marginTop: -0 }}
            taglineStyle={{ fontSize: 50 * logoScale, marginBottom: 25, ...taglineStyle }}
            taglineSecondary={taglineSecondary}
            taglineSecondaryStyle={{
              marginTop: 19,
              fontSize: 28 * logoScale,
              maxWidth: 680 * logoScale,
              lineHeight: 1.3,
              ...taglineSecondaryStyle,
            }}
          />
        )}
      </div>
    </div>
  )
}
