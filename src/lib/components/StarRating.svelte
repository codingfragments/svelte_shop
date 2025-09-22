<script lang="ts">
	interface Props {
		rating: number;
		maxRating?: number;
		size?: 'sm' | 'md' | 'lg';
		showValue?: boolean;
		interactive?: boolean;
		onRatingChange?: (rating: number) => void;
	}
	
	let {
		rating,
		maxRating = 5,
		size = 'md',
		showValue = true,
		interactive = false,
		onRatingChange
	}: Props = $props();
	
	let hoverRating = 0;
	
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	};
	
	const textSizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg'
	};
	
	function handleStarClick(starRating: number) {
		if (interactive && onRatingChange) {
			onRatingChange(starRating);
		}
	}
	
	function handleMouseEnter(starRating: number) {
		if (interactive) {
			hoverRating = starRating;
		}
	}
	
	function handleMouseLeave() {
		if (interactive) {
			hoverRating = 0;
		}
	}
	
	function getStarFill(starIndex: number): string {
		const currentRating = interactive && hoverRating > 0 ? hoverRating : rating;
		const difference = currentRating - starIndex;
		
		if (difference >= 1) {
			return '100%';
		} else if (difference > 0) {
			return `${difference * 100}%`;
		} else {
			return '0%';
		}
	}
</script>

<div class="flex items-center space-x-2">
	<div class="flex items-center space-x-1" role="img" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
		{#each Array(maxRating) as _, index}
			<div class="relative {interactive ? 'cursor-pointer' : ''}">
				<button
					class="relative {sizeClasses[size]} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-bg-primary rounded"
					class:cursor-pointer={interactive}
					class:cursor-default={!interactive}
					disabled={!interactive}
					on:click={() => handleStarClick(index + 1)}
					on:mouseenter={() => handleMouseEnter(index + 1)}
					on:mouseleave={handleMouseLeave}
					aria-label={interactive ? `Rate ${index + 1} stars` : undefined}
				>
					<!-- Background star (empty) -->
					<svg
						class="absolute inset-0 {sizeClasses[size]} text-overlay0"
						fill="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
					
					<!-- Filled star (gradient) -->
					<svg
						class="relative {sizeClasses[size]} text-yellow"
						fill="none"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<linearGradient id="star-gradient-{index}" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="{getStarFill(index + 1)}" style="stop-color:currentColor;stop-opacity:1" />
								<stop offset="{getStarFill(index + 1)}" style="stop-color:currentColor;stop-opacity:0" />
							</linearGradient>
						</defs>
						<path
							fill="url(#star-gradient-{index})"
							d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
						/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
	
	{#if showValue}
		<span class="font-medium text-text-primary {textSizeClasses[size]}">
			{rating.toFixed(1)}
		</span>
	{/if}
</div>