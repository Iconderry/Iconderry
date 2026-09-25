Add-Type -AssemblyName System.Drawing

$srcFile = "C:\Users\sahil\.gemini\antigravity-ide\brain\0d8226f5-1392-4ea5-8778-cc7bef46a6a5\.user_uploaded\media_1790350356467.jpg"
$baseDir = "c:\Users\sahil\Desktop\SHAHIM\cursor all projects\pixlflow"

if (-not (Test-Path $srcFile)) {
    Write-Error "Source file not found: $srcFile"
    exit 1
}

$raw = [System.Drawing.Bitmap]::FromFile($srcFile)
$w = $raw.Width
$h = $raw.Height

# Create 32-bit ARGB bitmap
$master = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($master)
$g.DrawImage($raw, 0, 0, $w, $h)
$g.Dispose()
$raw.Dispose()

# Lock bits for fast corner transparency processing
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$data = $master.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = [Math]::Abs($data.Stride) * $h
$rgbValues = New-Object byte[] $bytes
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $rgbValues, 0, $bytes)

# BFS flood fill from 4 corners to find all connected black pixels (corners outside the squircle)
$visited = New-Object bool[] ($w * $h)
$queue = New-Object System.Collections.Generic.Queue[int]

function TryEnqueue($x, $y) {
    if ($x -ge 0 -and $x -lt $w -and $y -ge 0 -and $y -lt $h) {
        $idx = $y * $w + $x
        if (-not $visited[$idx]) {
            $visited[$idx] = $true
            $byteIdx = $idx * 4
            $b = $rgbValues[$byteIdx]
            $g = $rgbValues[$byteIdx + 1]
            $r = $rgbValues[$byteIdx + 2]
            # If black / near black corner background
            if ($r -lt 25 -and $g -lt 25 -and $b -lt 25) {
                $queue.Enqueue($idx)
            }
        }
    }
}

# Start from 4 corners
TryEnqueue 0 0
TryEnqueue ($w - 1) 0
TryEnqueue 0 ($h - 1)
TryEnqueue ($w - 1) ($h - 1)

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $byteIdx = $curr * 4
    # Set Alpha to 0
    $rgbValues[$byteIdx + 3] = 0

    $cx = $curr % $w
    $cy = [int]($curr / $w)

    TryEnqueue ($cx + 1) $cy
    TryEnqueue ($cx - 1) $cy
    TryEnqueue $cx ($cy + 1)
    TryEnqueue $cx ($cy - 1)
}

[System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $data.Scan0, $bytes)
$master.UnlockBits($data)

Write-Host "Corner transparency processed successfully."

# Function to resize and save high quality PNG
function Save-ResizedPng($srcBmp, $outPath, $targetW, $targetH) {
    $dir = [System.IO.Path]::GetDirectoryName($outPath)
    if (-not (Test-Path $dir)) {
        [System.IO.Directory]::CreateDirectory($dir) | Out-Null
    }
    $targetBmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $tg = [System.Drawing.Graphics]::FromImage($targetBmp)
    $tg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $tg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $tg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $tg.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $tg.Clear([System.Drawing.Color]::Transparent)
    $tg.DrawImage($srcBmp, 0, 0, $targetW, $targetH)
    $tg.Dispose()

    if (Test-Path $outPath) {
        Remove-Item -Force $outPath
    }
    $targetBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
    Write-Host "Saved: $outPath ($targetW x $targetH)"
}

# 1. Web Public Assets
Save-ResizedPng $master "$baseDir\public\app-icon.png" 1024 1024
Save-ResizedPng $master "$baseDir\public\app-icon-rounded.png" 1024 1024
Save-ResizedPng $master "$baseDir\public\logo.png" 1024 1024
Save-ResizedPng $master "$baseDir\public\favicon.png" 512 512
Save-ResizedPng $master "$baseDir\public\favicon-32x32.png" 32 32
Save-ResizedPng $master "$baseDir\public\apple-touch-icon.png" 180 180
Save-ResizedPng $master "$baseDir\public\pwa-192x192.png" 192 192
Save-ResizedPng $master "$baseDir\public\pwa-512x512.png" 512 512
Save-ResizedPng $master "$baseDir\public\pwa-maskable-192x192.png" 192 192
Save-ResizedPng $master "$baseDir\public\pwa-maskable-512x512.png" 512 512

# 2. Android App Launcher Icons
$androidRes = "$baseDir\android\app\src\main\res"
if (Test-Path $androidRes) {
    Save-ResizedPng $master "$androidRes\mipmap-mdpi\ic_launcher.png" 48 48
    Save-ResizedPng $master "$androidRes\mipmap-mdpi\ic_launcher_round.png" 48 48
    Save-ResizedPng $master "$androidRes\mipmap-mdpi\ic_launcher_foreground.png" 108 108

    Save-ResizedPng $master "$androidRes\mipmap-hdpi\ic_launcher.png" 72 72
    Save-ResizedPng $master "$androidRes\mipmap-hdpi\ic_launcher_round.png" 72 72
    Save-ResizedPng $master "$androidRes\mipmap-hdpi\ic_launcher_foreground.png" 162 162

    Save-ResizedPng $master "$androidRes\mipmap-xhdpi\ic_launcher.png" 96 96
    Save-ResizedPng $master "$androidRes\mipmap-xhdpi\ic_launcher_round.png" 96 96
    Save-ResizedPng $master "$androidRes\mipmap-xhdpi\ic_launcher_foreground.png" 216 216

    Save-ResizedPng $master "$androidRes\mipmap-xxhdpi\ic_launcher.png" 144 144
    Save-ResizedPng $master "$androidRes\mipmap-xxhdpi\ic_launcher_round.png" 144 144
    Save-ResizedPng $master "$androidRes\mipmap-xxhdpi\ic_launcher_foreground.png" 324 324

    Save-ResizedPng $master "$androidRes\mipmap-xxxhdpi\ic_launcher.png" 192 192
    Save-ResizedPng $master "$androidRes\mipmap-xxxhdpi\ic_launcher_round.png" 192 192
    Save-ResizedPng $master "$androidRes\mipmap-xxxhdpi\ic_launcher_foreground.png" 432 432
}

$master.Dispose()
Write-Host "All logo icons generated and replaced successfully!"
