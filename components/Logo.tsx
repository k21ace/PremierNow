export default function Logo() {
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 左の縦バー */}
      <rect x="0" y="0" width="5" height="38" rx="2.5" fill="#00a8e8" />
      {/* PREMIER */}
      <text
        x="12"
        y="14"
        fontSize="7.5"
        fontWeight="400"
        fill="#7a8fc0"
        fontFamily="'Helvetica Neue',Arial,sans-serif"
        letterSpacing="3.5"
      >
        PREMIER
      </text>
      {/* NOW */}
      <text
        x="10"
        y="30"
        fontSize="16"
        fontWeight="800"
        fill="white"
        fontFamily="'Helvetica Neue',Arial,sans-serif"
        letterSpacing="-0.5"
      >
        NOW
      </text>
      {/* 縦バー区切り */}
      <line x1="60" y1="18" x2="60" y2="30" stroke="#3a4a7a" strokeWidth="1.2" />
      {/* プレなう */}
      <text
        x="66"
        y="28"
        fontSize="8"
        fontWeight="400"
        fill="#00a8e8"
        fontFamily="'Helvetica Neue',Arial,sans-serif"
        letterSpacing="1"
      >
        プレなう
      </text>
      {/* アンダーライン（縦バーより右のみ） */}
      <line
        x1="63"
        y1="34"
        x2="110"
        y2="34"
        stroke="#00a8e8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
