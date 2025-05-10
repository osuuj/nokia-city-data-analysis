# Run this script as Administrator on Windows to exclude your project directory from antivirus scanning
# This will improve performance in WSL

$projectPath = "\\wsl$\Ubuntu-24.04\home\justus\repos\etl-to-visualization\nokia-city-data-analysis"
$tempBuildPath = "\\wsl$\Ubuntu-24.04\tmp\next-build-cache"

Write-Host "Adding exclusions for Next.js project in WSL..."

# Add the project directory to Windows Defender exclusions
Add-MpPreference -ExclusionPath $projectPath -ErrorAction SilentlyContinue
if ($?) {
    Write-Host "✅ Added project directory to exclusions: $projectPath"
} else {
    Write-Host "❌ Failed to add project directory to exclusions. Make sure you're running as Administrator."
}

# Add the temp build directory to Windows Defender exclusions
Add-MpPreference -ExclusionPath $tempBuildPath -ErrorAction SilentlyContinue
if ($?) {
    Write-Host "✅ Added temp build directory to exclusions: $tempBuildPath"
} else {
    Write-Host "❌ Failed to add temp build directory to exclusions."
}

Write-Host "Done! Your Next.js project should now build faster in WSL."
Write-Host "Note: You may need to restart your development server." 